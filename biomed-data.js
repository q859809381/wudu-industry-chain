// 生物医药产业链图谱明细（源自 桌面/生物医药.xlsx，工作表"生物医药"）
// 聚合口径：l1=一级环节（上游/中游/下游/专业服务），l2=三级环节（创新药、核酸药物、疫苗类等）
// paths=四级及以下细分路径（"四级 > 五级"），parents=原表二级归属，供检索与说明使用
// 原表"代表企业""关键词"列暂无标注，companies/terms 留空，由系统按样本规则补齐；"是否为核心环节"按原表保留
const biomedNodes = [
  {
    "l1": "上游",
    "l2": "化药原料药",
    "parents": [
      "化学药"
    ],
    "rowCount": 2,
    "paths": [
      "大宗原料药",
      "特色原料药"
    ],
    "coreCount": 1,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "特色原料药"
    ],
    "isCore": true
  },
  {
    "l1": "上游",
    "l2": "耗材",
    "parents": [
      "生物制品",
      "化学药/生物制品/中药"
    ],
    "rowCount": 10,
    "paths": [
      "细胞株",
      "超滤膜",
      "生物反应器",
      "疫苗佐剂",
      "细胞培养基",
      "包膜耗材",
      "药用辅料",
      "层析填料",
      "酶制剂",
      "试剂（生化试剂、细胞制剂、分子试剂、抗体试剂）"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "上游",
    "l2": "中药材",
    "parents": [
      "中药"
    ],
    "rowCount": 1,
    "paths": [
      "中药材"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "上游",
    "l2": "制药设备",
    "parents": [
      "中药",
      "化学药/生物制品/中药"
    ],
    "rowCount": 3,
    "paths": [
      "饮片机械",
      "原料药机械及设备",
      "制剂机械"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "上游",
    "l2": "研发设备",
    "parents": [
      "化学药/生物制品/中药"
    ],
    "rowCount": 2,
    "paths": [
      "色谱（高效液相色谱、液质联用仪器、气相色谱）",
      "质谱仪"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "中游",
    "l2": "创新药",
    "parents": [
      "化学药"
    ],
    "rowCount": 18,
    "paths": [
      "罕见病",
      "传染病",
      "肿瘤",
      "神经系统疾病",
      "胃肠道疾病",
      "心血管疾病",
      "感染疾病",
      "泌尿系统疾病",
      "代谢紊乱",
      "肌肉骨骼系统疾病",
      "内分泌系统疾病",
      "自免疾病",
      "眼病",
      "皮肤病",
      "呼吸系统疾病",
      "耳鼻咽喉疾病",
      "口腔疾病",
      "其它"
    ],
    "coreCount": 7,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "罕见病",
      "传染病",
      "肿瘤",
      "神经系统疾病",
      "心血管疾病",
      "感染疾病",
      "自免疾病"
    ],
    "isCore": true
  },
  {
    "l1": "中游",
    "l2": "改良型新药",
    "parents": [
      "化学药"
    ],
    "rowCount": 8,
    "paths": [
      "混悬型注射剂",
      "微球",
      "胶体",
      "脂质体",
      "纳米制剂",
      "悬浮液",
      "缓释制剂",
      "其它"
    ],
    "coreCount": 3,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "微球",
      "脂质体",
      "纳米制剂"
    ],
    "isCore": true
  },
  {
    "l1": "中游",
    "l2": "仿制药",
    "parents": [
      "化学药"
    ],
    "rowCount": 1,
    "paths": [
      "仿制药"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "中游",
    "l2": "核酸药物",
    "parents": [
      "生物制品"
    ],
    "rowCount": 5,
    "paths": [
      "反义核酸",
      "核酸偶联药物",
      "核酸适体",
      "microRNA",
      "mRNA"
    ],
    "coreCount": 3,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "反义核酸",
      "核酸偶联药物",
      "mRNA"
    ],
    "isCore": true
  },
  {
    "l1": "中游",
    "l2": "蛋白及多肽药物",
    "parents": [
      "生物制品"
    ],
    "rowCount": 11,
    "paths": [
      "多肽药物",
      "细胞因子（干扰素、生长因子、白介素）",
      "生长激素",
      "胰岛素",
      "单克隆抗体",
      "多特异性抗体",
      "抗体偶联药物(ADC)",
      "抗体融合蛋白",
      "其他抗体",
      "融合蛋白",
      "其他蛋白及多肽药物"
    ],
    "coreCount": 5,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "多肽药物",
      "胰岛素",
      "单克隆抗体",
      "多特异性抗体",
      "抗体偶联药物(ADC)"
    ],
    "isCore": true
  },
  {
    "l1": "中游",
    "l2": "细胞与基因疗法",
    "parents": [
      "生物制品"
    ],
    "rowCount": 7,
    "paths": [
      "单能干细胞疗法",
      "多能干细胞疗法",
      "全能干细胞疗法",
      "特异性免疫细胞疗法",
      "非特异性免疫细胞疗法",
      "基因治疗",
      "其他细胞与基因疗法"
    ],
    "coreCount": 4,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "多能干细胞疗法",
      "特异性免疫细胞疗法",
      "非特异性免疫细胞疗法",
      "基因治疗"
    ],
    "isCore": true
  },
  {
    "l1": "中游",
    "l2": "血液制品",
    "parents": [
      "生物制品"
    ],
    "rowCount": 2,
    "paths": [
      "凝血因子",
      "白蛋白"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "中游",
    "l2": "疫苗类",
    "parents": [
      "生物制品"
    ],
    "rowCount": 5,
    "paths": [
      "减毒疫苗",
      "灭活疫苗",
      "蛋白疫苗",
      "载体疫苗（腺病毒、慢病毒）",
      "核酸疫苗"
    ],
    "coreCount": 1,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "核酸疫苗"
    ],
    "isCore": true
  },
  {
    "l1": "中游",
    "l2": "中药配方颗粒",
    "parents": [
      "中药"
    ],
    "rowCount": 1,
    "paths": [
      "中药配方颗粒"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "中游",
    "l2": "中药饮片",
    "parents": [
      "中药"
    ],
    "rowCount": 1,
    "paths": [
      "中药饮片"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "中游",
    "l2": "中成药",
    "parents": [
      "中药"
    ],
    "rowCount": 1,
    "paths": [
      "中成药"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "下游",
    "l2": "医疗机构",
    "parents": [
      "化学/生物制品/中药"
    ],
    "rowCount": 1,
    "paths": [],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "下游",
    "l2": "流通企业",
    "parents": [
      "化学/生物制品/中药"
    ],
    "rowCount": 1,
    "paths": [],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "下游",
    "l2": "零售药店",
    "parents": [
      "化学/生物制品/中药"
    ],
    "rowCount": 1,
    "paths": [],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  },
  {
    "l1": "专业服务",
    "l2": "类器官",
    "parents": [
      "耗材供应商"
    ],
    "rowCount": 1,
    "paths": [
      "类器官"
    ],
    "coreCount": 1,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [
      "类器官"
    ],
    "isCore": true
  },
  {
    "l1": "专业服务",
    "l2": "实验动物",
    "parents": [
      "耗材供应商"
    ],
    "rowCount": 5,
    "paths": [
      "鼠",
      "猴",
      "猪",
      "狗",
      "其他（斑马鱼等）"
    ],
    "coreCount": 0,
    "companyCount": 0,
    "companies": [],
    "companyTotal": 0,
    "terms": [],
    "corePaths": [],
    "isCore": false
  }
];
