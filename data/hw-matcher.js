/* ============================================================
   型号参数库 —— 判定辅助
   作用：把「i5-14500」这类型号名展开成参数，与招标要求逐项比较。

   解决的问题：
     招标「不少于6核12线程，TDP≤35W（性能不低于 i5-10500T）」
     投标「i5-14500」
     → 不展开的话只能靠模型猜，容易判成"低于要求"；展开后是硬数据。
   ============================================================ */

/* 用户自定义库（localStorage），覆盖同名内置条目 */
const HW_STORE_KEY = 'bidchecker_hw_specs_v1';

/* 载入：内置 + 用户覆盖 */
let HW_SPECS = {};
function loadHwSpecs(){
  let custom={};
  try{ custom=JSON.parse(localStorage.getItem(HW_STORE_KEY)||'{}')||{}; }catch(e){ custom={}; }
  HW_SPECS=Object.assign({}, HW_SPECS_BUILTIN, custom);
  return HW_SPECS;
}
/* 保存用户改动 */
function saveHwSpecs(obj){
  try{ localStorage.setItem(HW_STORE_KEY, JSON.stringify(obj||{})); return true; }
  catch(e){ return false; }
}
function hwUserSpecs(){
  try{ return JSON.parse(localStorage.getItem(HW_STORE_KEY)||'{}')||{}; }catch(e){ return {}; }
}

/* 型号归一：去空格、转小写，便于宽松匹配 */
function normModel(s){
  // 去掉空格与连字符/下划线："i9 9900KF" 与库内 "i9-9900k" 都要能对上
  return String(s??'').toLowerCase()
    .replace(/\s+/g,'')
    .replace(/[-_－—]/g,'')
    .replace(/酷睿/g,'intel')
    .replace(/锐龙/g,'ryzen')
    .replace(/英特尔/g,'intel')
    .replace(/amd\s*/g,'');
}

/* 从文本中提取型号
   —— 按库内 key 长度降序匹配，避免 "i5-14500" 被 "i5-1450" 抢先命中 */
function extractModels(text){
  const raw=String(text??'');
  if(!raw.trim()) return [];
  const nt=normModel(raw);
  const keys=Object.keys(HW_SPECS).sort((a,b)=>b.length-a.length);
  const hits=[];
  for(const k of keys){
    const nk=normModel(k);
    if(!nk) continue;
    if(nt.includes(nk)){
      hits.push({model:k, spec:HW_SPECS[k]});
    }
  }
  // 剔除被更长命中包含的短项："i5-10500t" 命中时，"i5-10500" 不应重复命中
  return hits.filter(h=>!hits.some(o=>o!==h && normModel(o.model).includes(normModel(h.model))));
}

/* 从文本里提取「型号 + 该型号的规格」中可用于比较的字段 */
function specFields(spec){
  if(!spec) return {};
  const f={};
  if(spec.cores!=null)   f.cores=spec.cores;
  if(spec.threads!=null) f.threads=spec.threads;
  if(spec.base!=null)    f.base=spec.base;
  if(spec.boost!=null)   f.boost=spec.boost;
  if(spec.tdp!=null)     f.tdp=spec.tdp;
  if(spec.vram!=null)    f.vram=spec.vram;
  if(spec.size!=null)    f.size=spec.size;
  return f;
}

/* 招标要求里可比较的指标 → {field, op, value}
   op: '>=' 下限 | '<=' 上限
   只取能一对一对应的字段：核数/线程数/频率/功耗/显存/尺寸。
   统一格式：正则第1捕获组=比较词，第2捕获组=数值。 */
function requirementTargets(aText){
  const t=String(aText??'');
  const out=[];
  const LOW ='不多于|不超过|不高于|不大于|低于上限|≤|<=|最高|最多|小于等于|不超过或等于';
  const HIGH='不少于|不低于|不小于|至少|大于等于|≥|>=|最低|最少|不小于或等于';
  const scan=(re,field,label,defOp)=>{
    let m;
    while((m=re.exec(t))!==null){
      const kw=m[1]||'', v=parseFloat(m[2]);
      if(isNaN(v)) continue;
      const isLow=new RegExp(LOW).test(kw), isHigh=new RegExp(HIGH).test(kw);
      out.push({field, op:isLow?'<=':(isHigh?'>=':defOp), value:v, label});
    }
  };
  // 核数：数字+核
  scan(new RegExp(`(${LOW}|${HIGH})?\\s*(\\d+)\\s*核`,'g'),'cores','核数','>=');
  // 线程数：数字+线程
  scan(new RegExp(`(${LOW}|${HIGH})?\\s*(\\d+)\\s*线程`,'g'),'threads','线程数','>=');
  // 频率类：标签在前，数值在后
  scan(new RegExp(`(?:基础频率|主频)\\s*(?:应|需|须)?\\s*(${LOW}|${HIGH})?\\s*(\\d+(?:\\.\\d+)?)`,'g'),'base','基础频率','>=');
  scan(new RegExp(`(?:最大睿频|睿频|最高频率)\\s*(?:应|需|须)?\\s*(${LOW}|${HIGH})?\\s*(\\d+(?:\\.\\d+)?)`,'g'),'boost','最大睿频','>=');
  // 功耗
  scan(new RegExp(`(?:TDP|功耗|整包功耗)\\s*(?:应|需|须)?\\s*(${LOW}|${HIGH})?\\s*(\\d+(?:\\.\\d+)?)`,'g'),'tdp','功耗','<=');
  // 显存
  scan(new RegExp(`(?:显存|图形内存|VRAM)\\s*(?:应|需|须)?\\s*(${LOW}|${HIGH})?\\s*(\\d+(?:\\.\\d+)?)`,'g'),'vram','显存','>=');
  // 尺寸（英寸）
  scan(/(\d+(?:\.\d+)?)\s*英寸/g,'size','尺寸','>=');
  return out;
}

/* 比较：规格字段 vs 招标要求
   返回 {verdict:'matched'|'positive'|'negative'|'unknown', checks:[...]} */
function compareSpec(spec, targets){
  const checks=[];
  let worst='matched', better=false, worse=false;
  for(const tg of targets){
    const v=spec?spec[tg.field]:undefined;
    if(v==null){ checks.push({...tg,actual:null,ok:null}); continue; }
    let ok;
    if(tg.op==='>=') ok = v>=tg.value;
    else if(tg.op==='<=') ok = v<=tg.value;
    else ok = v===tg.value;
    checks.push({...tg,actual:v,ok});
    if(!ok) worse=true; else if(tg.op==='>='&&v>tg.value) better=true;
    else if(tg.op==='<='&&v<tg.value) better=true;
  }
  const comparable=checks.filter(c=>c.ok!==null);
  if(!comparable.length) return {verdict:'unknown',checks};
  if(worse) worst='negative';
  else if(better) worst='positive';
  else worst='matched';
  return {verdict:worst,checks};
}

/* 型号性能对比：投标型号 vs 招标里点名的对标型号
   用于「性能不低于 i5-10500T」这类整体性能表述——
   核心数/线程数/主频全面不差即视为达标，功耗等散热约束不参与。 */
function compareModels(bidModel, refModel){
  const a=HW_SPECS[bidModel], b=HW_SPECS[refModel];
  if(!a||!b) return {verdict:'unknown',checks:[]};
  const fields=['cores','threads','boost'];   // 不比 base：不同定位的芯片基础频率不可比
  const checks=[]; let worse=false, better=false;
  for(const f of fields){
    if(a[f]==null||b[f]==null) continue;
    const ok=a[f]>=b[f];
    checks.push({field:f,actual:a[f],ref:b[f],ok});
    if(!ok) worse=true; else if(a[f]>b[f]) better=true;
  }
  if(!checks.length) return {verdict:'unknown',checks};
  return {verdict:worse?'negative':(better?'positive':'matched'),checks};
}

/* 从招标条目里找出「性能不低于/相当于 XX型号」这类对标型号
   对标型号必然出现在【招标列 A】（投标列 B 是投标方自己的型号） */
function findRefModel(aText){
  const t=String(aText??'');
  if(!/(不低于|相当于|对比|优于|同于|对标|等同于|不得低于|不低于|以上)/.test(t)) return null;
  const ms=extractModels(t);
  if(!ms.length) return null;
  // 取最后一个（对标型号通常写在括号补充说明里，位置靠后）
  return ms[ms.length-1].model;
}

/* ============================================================
   型号参数裁决：把招标要求与投标型号放在同一维度上比较。
   aText  招标条目原文
   bText  投标侧对应条目原文（可能为空）
   bFull  投标单元格全文（型号可能写在别的条目里，如"1、处理器：i5-14500"）

   返回 null 表示"型号库帮不上忙"，交回原有判定逻辑；
   返回 {status,note,confidence} 表示型号库给出的裁决。
   ============================================================ */
function judgeBySpecs(aText, bText, bFull){
  const A=String(aText||''), B=String(bText||''), BF=String(bFull||'');
  if(!A.trim()) return null;
  const targets=requirementTargets(A);
  if(!targets.length) return null;                 // 招标要求里没有可比较的量化指标

  // 找投标侧型号（先看对应条目，再看整格）
  let bidModels=extractModels(B);
  if(!bidModels.length) bidModels=extractModels(BF);
  const refModel=findRefModel(A);

  // 情形1：投标侧有型号 → 展开比较
  if(bidModels.length){
    const bid=bidModels[0].model, spec=bidModels[0].spec;
    // 1a. 招标点名了对标型号 → 用型号间性能对比（功耗等散热约束不参与）
    if(refModel && refModel!==bid && HW_SPECS[refModel]){
      const cmp=compareModels(bid, refModel);
      if(cmp.verdict!=='unknown'){
        const detail=cmp.checks.map(c=>{
          const nm={cores:'核数',threads:'线程数',boost:'睿频'}[c.field]||c.field;
          return `${nm}${c.actual}vs${c.ref}`;
        }).join('、');
        if(cmp.verdict==='negative'){
          return {status:'negative',note:`${bid} 性能低于对标型号 ${refModel}（${detail}）`};
        }
        if(cmp.verdict==='positive'){
          return {status:'positive',note:`${bid} 性能优于对标型号 ${refModel}（${detail}）`};
        }
        return {status:'matched',note:`${bid} 与对标型号 ${refModel} 性能相当`};
      }
    }
    // 1b. 无对标型号 → 逐字段比较
    const cmp=compareSpec(spec, targets);
    if(cmp.verdict!=='unknown'){
      const bad=cmp.checks.filter(c=>c.ok===false);
      const good=cmp.checks.filter(c=>c.ok===true && ((c.op==='>='&&c.actual>c.value)||(c.op==='<='&&c.actual<c.value)));
      if(cmp.verdict==='negative'){
        const d=bad.map(c=>`${c.label} ${c.actual}${c.op==='>='?'<':'>'}要求${c.value}`).join('，');
        return {status:'negative',note:`${bid} ${d}`};
      }
      if(cmp.verdict==='positive'){
        const d=good.map(c=>`${c.label} ${c.actual}优于要求${c.value}`).join('，');
        return {status:'positive',note:`${bid} ${d}`};
      }
      return {status:'matched',note:`${bid} 参数满足要求`};
    }
  }

  // 情形2：招标点名了对标型号，但投标侧没给型号 → 无法核实
  if(refModel && !bidModels.length){
    const missing=targets.filter(t=>t.field==='cores'||t.field==='threads'||t.field==='base'||t.field==='boost'||t.field==='vram');
    if(missing.length){
      return {status:'uncertain',note:`投标未给出具体型号，需人工核对是否达到 ${refModel} 规格`,confidence:0.6};
    }
  }
  return null;
}
