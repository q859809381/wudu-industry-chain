const industryTypeOrder = ['六大新兴支柱产业', '六大未来产业', '六张网'];

const nationalIndustryEntries = (Array.isArray(nationalIndustryCatalog) ? nationalIndustryCatalog : [])
  .map((entry, order) => ({ ...entry, order }));
const nationalIndustryTypeMap = nationalIndustryEntries.reduce((map, entry) => {
  const types = map.get(entry.name) || [];
  if (!types.includes(entry.type)) types.push(entry.type);
  map.set(entry.name, types);
  return map;
}, new Map());

// The national catalog and provincial systems use different but overlapping names.
// Keep the catalog labels visible while using these source-backed aliases for joins.
const industryNameAliases = {
  '半导体与集成电路': ['半导体与集成电路', '集成电路', '半导体', '集成电路与电子元器件'],
  '钢材产业': ['钢材产业', '钢铁', '精品钢铁', '绿色钢铁', '特钢', '冶金', '新型冶金', '高品质钢铁材料'],
  '石化产业': ['石化产业', '石化', '石油化工', '石化化工', '绿色石化', '精细石化', '精细化工', '现代石化', '现代化工', '煤化工', '现代煤化工', '能源化工'],
  '船舶产业': ['船舶产业', '船舶', '船舶海工', '船舶与海工装备', '海工装备', '海洋经济'],
  '电子信息': ['电子信息', '新一代电子信息', '光电子信息', '新一代光电信息', '电子元器件', '数字信息', '信息服务', '信息技术服务'],
  '机械装备': ['机械装备', '机械', '工程机械', '装备制造', '先进装备制造', '高端装备制造', '高端装备', '重大技术装备', '农机装备', '轨道交通装备'],
  '高端新材料': ['高端新材料', '新材料', '先进新材料', '先进材料', '新型材料', '前沿新材料', '新型功能材料', '特种金属材料', '稀土新材料', '轻量化材料', '高端铝材', '煤基新材料'],
  '基础零部件和元器件': ['基础零部件和元器件', '零部件', '元器件', '汽车及零部件', '汽车整车及零部件'],
  '基础软件和工业软件': ['基础软件和工业软件', '基础软件', '工业软件', '高端软件', '软件', '软件与信息服务', '信息服务'],
  '工业母机': ['工业母机', '数控机床', '机床', '工业母机产业集群'],
  '高端仪器仪表': ['高端仪器仪表', '仪器仪表', '仪器仪表产业集群', '精密仪器设备'],
  '重大技术装备': ['重大技术装备', '高端装备制造', '高端装备', '装备制造', '先进装备制造', '工程机械', '煤机装备'],
  '新一代信息技术': ['新一代信息技术', '新一代电子信息', '新一代光电信息', '信息技术', '电子信息', '光电子', '光电子信息', '数字信息', '数字产业', '数字经济', '数字服务', '算力大数据', '信创', '软件'],
  '新能源': ['新能源', '绿色能源', '风光新能源', '清洁能源', '新能源锂电', '新能源新材料', '新能源及储能', '新能源及绿色低碳', '新能源与智能网联汽车', '光伏', '硅光伏', '光伏储能', '储能', '氢能'],
  '新材料': ['新材料', '先进新材料', '先进材料', '新型材料', '前沿新材料', '新型功能材料', '特种金属材料', '稀土新材料', '轻量化材料', '高端新材料', '煤基新材料', '材料'],
  '智能网联新能源汽车': ['智能网联新能源汽车', '智能网联汽车', '新能源汽车', '新能源与智能网联汽车', '汽车及零部件', '汽车整车及零部件'],
  '机器人': ['机器人', '智能机器人', '人形机器人', '人工智能与机器人'],
  '生物医药': ['生物医药', '高端生物医药', '现代医药', '医药健康', '生物医药与健康', '生物医药和先进医疗装备', '健康医药产业', '食品医药', '中医药', '中藏药', '大健康'],
  '高端装备': ['高端装备', '高端装备制造', '先进装备制造', '装备制造', '重大技术装备', '工程机械', '轨道交通装备', '农机装备'],
  '航空航天': ['航空航天', '航空制造', '航天', '空天信息', '空天海洋', '深海空天', '航天装备', '商业航天'],
  '低空经济': ['低空经济', '低空装备'],
  '海洋经济': ['海洋经济', '海洋', '海工装备', '船舶海工', '深海', '空天海洋'],
  '新型电池': ['新型电池', '新能源锂电', '锂电储能', '储能', '新能源及储能'],
  '商业航天': ['商业航天', '航天', '航空航天', '航天装备'],
  '低空装备': ['低空装备', '低空经济'],
  '量子科技': ['量子科技', '量子信息', '区块链与量子信息'],
  '生物制造': ['生物制造', '合成生物', '生命生物技术', '生物经济', '生命科学', '生命工程', '未来生命健康'],
  '绿色氢能': ['绿色氢能', '氢能', '氢能与新型储能', '绿色能源'],
  '核聚变能': ['核聚变能', '核聚变能源'],
  '脑机接口': ['脑机接口', '脑科学与脑机接口'],
  '具身智能': ['具身智能', '人形机器人', '类脑智能', '人工智能', '智能机器人'],
  '第六代移动通信': ['第六代移动通信', '6G'],
  '新型储能': ['新型储能', '储能', '新型电池', '新能源及储能', '锂电储能', '氢能与新型储能'],
  '智能机器人': ['智能机器人', '机器人', '人形机器人', '人工智能与机器人'],
  '绿色氢能和核聚变能': ['绿色氢能和核聚变能', '绿色氢能', '氢能', '核聚变能', '核聚变能源', '核聚变'],
  '6G': ['6G', '第六代移动通信'],
  '算力网': ['算力网', '算力网络', '算力', '算力大数据'],
  '物联网': ['物联网', '工业互联网'],
  '新型电网': ['新型电网', '智能电网', '电网'],
  '水网': ['水网', '国家水网'],
  '新一代通信网': ['新一代通信网', '新一代信息网络', '通信网络'],
  '城市地下管网': ['城市地下管网', '地下管网', '管网']
};

function normalizeIndustryName(value) {
  return String(value || '')
    .replace(/[\s\u00a0]+/g, '')
    .replace(/[（）]/g, (char) => char === '（' ? '(' : ')')
    .toLowerCase();
}

function industryNameMatches(entryName, selectedName) {
  if (!selectedName || selectedName === '不限') return true;
  const normalizedEntry = normalizeIndustryName(entryName);
  const normalizedSelected = normalizeIndustryName(selectedName);
  if (!normalizedEntry || !normalizedSelected) return false;
  if (normalizedEntry === normalizedSelected) return true;
  const aliases = industryNameAliases[selectedName] || [selectedName];
  return aliases.some((alias) => {
    const normalizedAlias = normalizeIndustryName(alias);
    return normalizedAlias === normalizedEntry || normalizedEntry.includes(normalizedAlias);
  });
}

function cleanChainName(value) {
  return String(value || '')
    .replace(/^\s*[：:、,，;；]+/, '')
    .replace(/^\s*(?:[一二三四五六七八九十]+[、.．:：]|\d+[、.．:：]|[（(][一二三四五六七八九十]+[）)])\s*/, '')
    .replace(/^\s*[:：]\s*/, '')
    .replace(/^\s*\d+[.)）]\s*/, '')
    .replace(/^\s+|\s+$/g, '')
    .trim();
}

function extractChainNames(rawChains) {
  const names = String(rawChains || '')
    .replace(/低空经\s*[\r\n]+\s*济/g, '低空经济')
    .replace(/新装\s*[\r\n]+\s*备/g, '新装备')
    .replace(/人工智能及新一代信息技术产\s*[\r\n]+\s*业集群/g, '人工智能及新一代信息技术产业集群')
    .replace(/高端苦涩家居/g, '高端家居')
    .replace(/[\r\n]+/g, '、')
    .split(/[、,，;；]/)
    .map(cleanChainName)
    .map((name) => name.replace(/^[^：:]{1,24}[：:]\s*/, '').trim())
    .map((name) => name.replace(/[。．]+$/g, '').trim())
    .filter((name) => name.length > 1)
    .filter((name) => !/^(?:世界级|国家级|区域级|\d+|[一二三四五六七八九十]+大[^\s]*产业(?:集群)?|[^\s]*产业集群)$/.test(name))
    .filter((name) => !/(?:万亿级|千亿级|百亿级|五千亿级|个产业|产业体系|核心产业链名称)/.test(name))
    .filter((name) => !/^(?:新装|业集群|旅游业\d+|冶金建材\d+)$/.test(name));
  return [...new Set(names)];
}

const futureIndustryPattern = /未来|量子|脑机|脑科学|6G|元宇宙|氢能|生物制造|合成生物|原子级|超导|超宽禁带|聚变|深海空天|前沿/;
const strategicIndustryPattern = /半导体|集成电路|电子信息|信息技术|人工智能|新能源|储能|新材料|新型材料|功能材料|先进材料|高端装备|重大技术装备|智能|生物医药|生物技术|光电|光伏|数字|软件|精密仪器|航空航天|空天|机器人|低空|区块链|算力|信创|碳中和|绿色能源|医药健康|科技服务|智慧城市|生命生物/;
const traditionalIndustryPattern = /钢铁|冶金|石化|石油|化工|煤炭|煤电|煤化工|船舶|海工|纺织|轻工|食品|农产品|建材|机械|汽车|家电|铝|有色|矿产|农业|旅游|物流|金融|文旅/;

function inferIndustryTypes(name) {
  const officialTypes = nationalIndustryTypeMap.get(name);
  if (officialTypes?.length) return [...officialTypes];
  const types = [];
  if (traditionalIndustryPattern.test(name)) types.push('传统产业');
  if (strategicIndustryPattern.test(name)) types.push('战略性新兴产业');
  if (futureIndustryPattern.test(name)) types.push('未来产业');
  if (/电子信息|机械装备|高端新材料|重大技术装备/.test(name)) {
    if (!types.includes('传统产业')) types.push('传统产业');
    if (!types.includes('战略性新兴产业')) types.push('战略性新兴产业');
  }
  return types.length ? types : ['传统产业'];
}

const regionCatalog = officialRegionCatalog.map((item) => {
  const chainNames = extractChainNames(item.coreChains);
  return {
    ...item,
    chainNames,
    industryEntries: chainNames.map((name) => ({ name, types: inferIndustryTypes(name) }))
  };
});

// The workbook is province-level. Keep the finer administrative scope available
// for filtering without implying that the attached company sample has city data.
const provinceAreaCatalog = {
  北京市: { cities: ['北京市'], districts: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '通州区', '顺义区'] },
  天津市: { cities: ['天津市'], districts: ['和平区', '河东区', '河西区', '南开区', '滨海新区', '武清区'] },
  河北省: { cities: ['石家庄市', '唐山市', '秦皇岛市', '保定市', '廊坊市'], districts: ['长安区', '路北区', '海港区', '莲池区', '安次区'] },
  山西省: { cities: ['太原市', '大同市', '晋城市', '运城市'], districts: ['小店区', '迎泽区', '平城区', '城区'] },
  内蒙古自治区: { cities: ['呼和浩特市', '包头市', '鄂尔多斯市', '赤峰市'], districts: ['玉泉区', '昆都仑区', '东胜区'] },
  辽宁省: { cities: ['沈阳市', '大连市', '鞍山市', '丹东市'], districts: ['和平区', '甘井子区', '铁东区', '振兴区'] },
  吉林省: { cities: ['长春市', '吉林市', '四平市', '延边州'], districts: ['朝阳区', '南关区', '昌邑区'] },
  黑龙江省: { cities: ['哈尔滨市', '齐齐哈尔市', '大庆市', '牡丹江市'], districts: ['道里区', '南岗区', '龙凤区', '东安区'] },
  上海市: { cities: ['上海市'], districts: ['黄浦区', '徐汇区', '浦东新区', '闵行区', '嘉定区', '松江区'] },
  江苏省: { cities: ['南京市', '无锡市', '苏州市', '南通市', '常州市'], districts: ['鼓楼区', '滨湖区', '吴中区', '崇川区', '武进区'] },
  浙江省: { cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '金华市'], districts: ['余杭区', '鄞州区', '鹿城区', '秀洲区', '金东区'] },
  安徽省: { cities: ['合肥市', '芜湖市', '蚌埠市', '马鞍山市'], districts: ['蜀山区', '包河区', '镜湖区', '龙子湖区'] },
  福建省: { cities: ['福州市', '厦门市', '泉州市', '漳州市'], districts: ['鼓楼区', '思明区', '丰泽区', '龙文区'] },
  江西省: { cities: ['南昌市', '九江市', '赣州市', '宜春市'], districts: ['红谷滩区', '浔阳区', '章贡区', '袁州区'] },
  山东省: { cities: ['济南市', '青岛市', '烟台市', '潍坊市', '济宁市'], districts: ['历下区', '市南区', '芝罘区', '奎文区', '任城区'] },
  河南省: { cities: ['郑州市', '洛阳市', '开封市', '南阳市', '许昌市'], districts: ['金水区', '洛龙区', '龙亭区', '宛城区', '魏都区'] },
  湖北省: { cities: ['武汉市', '宜昌市', '襄阳市', '荆州市'], districts: ['武昌区', '洪山区', '西陵区', '樊城区'] },
  湖南省: { cities: ['长沙市', '株洲市', '湘潭市', '岳阳市'], districts: ['芙蓉区', '岳麓区', '天元区', '岳阳楼区'] },
  广东省: { cities: ['广州市', '深圳市', '佛山市', '东莞市', '珠海市', '惠州市'], districts: ['天河区', '南山区', '禅城区', '顺德区', '香洲区', '惠城区'] },
  广西壮族自治区: { cities: ['南宁市', '柳州市', '桂林市', '北海市'], districts: ['青秀区', '柳南区', '象山区', '海城区'] },
  海南省: { cities: ['海口市', '三亚市', '儋州市'], districts: ['龙华区', '吉阳区', '那大镇'] },
  重庆市: { cities: ['重庆市'], districts: ['渝中区', '江北区', '沙坪坝区', '九龙坡区', '两江新区'] },
  四川省: { cities: ['成都市', '绵阳市', '德阳市', '宜宾市', '泸州市'], districts: ['武侯区', '涪城区', '旌阳区', '翠屏区', '江阳区'] },
  贵州省: { cities: ['贵阳市', '遵义市', '安顺市', '毕节市'], districts: ['观山湖区', '云岩区', '红花岗区', '西秀区'] },
  云南省: { cities: ['昆明市', '曲靖市', '玉溪市', '大理州'], districts: ['五华区', '盘龙区', '麒麟区', '红塔区'] },
  西藏自治区: { cities: ['拉萨市', '日喀则市', '林芝市'], districts: ['城关区', '桑珠孜区', '巴宜区'] },
  陕西省: { cities: ['西安市', '宝鸡市', '咸阳市', '渭南市'], districts: ['雁塔区', '未央区', '金台区', '秦都区'] },
  甘肃省: { cities: ['兰州市', '天水市', '酒泉市', '白银市'], districts: ['城关区', '秦州区', '肃州区', '白银区'] },
  青海省: { cities: ['西宁市', '海东市', '格尔木市'], districts: ['城东区', '乐都区', '格尔木市区'] },
  宁夏回族自治区: { cities: ['银川市', '石嘴山市', '吴忠市', '固原市'], districts: ['兴庆区', '金凤区', '大武口区', '利通区'] },
  新疆维吾尔自治区: { cities: ['乌鲁木齐市', '喀什地区', '库尔勒市', '克拉玛依市'], districts: ['天山区', '沙依巴克区', '喀什市区', '库尔勒市区'] }
};

const regionSystems = regionCatalog.map(({ province, system }) => ({ province, system }));

function getRegionCities(province) {
  return provinceAreaCatalog[province]?.cities || [];
}

function getRegionDistricts(province, city) {
  if (!province || province === '不限' || !city || city === '不限') return [];
  const catalog = provinceAreaCatalog[province] || { cities: [], districts: [] };
  if (catalog.districtsByCity?.[city]) return catalog.districtsByCity[city];
  if (catalog.cities.length <= 1) return catalog.districts || [];
  const cityIndex = catalog.cities.indexOf(city);
  const district = catalog.districts?.[cityIndex];
  return district ? [district] : (catalog.districts || []);
}

function resolveSimulatedAdministrativeArea(province, address) {
  const cities = getRegionCities(province);
  const city = cities.find((item) => address.includes(item)) || cities[0] || '不限';
  const districts = getRegionDistricts(province, city);
  const district = districts.find((item) => address.includes(item)) || districts[0] || '不限';
  return { city, district };
}

const industryProfiles = {};

const semiconductorStageMeta = {
  设计: { key: 'design', subtitle: '芯片架构、IP 与产品定义', color: 'blue' },
  制造: { key: 'manufacturing', subtitle: '晶圆制造与工艺平台', color: 'teal' },
  封测: { key: 'packaging', subtitle: '封装、测试与先进封装', color: 'amber' },
  EDA: { key: 'eda', subtitle: '电子设计自动化软件', color: 'coral' },
  IP: { key: 'ip', subtitle: '接口、基础与处理器 IP', color: 'violet' },
  设备: { key: 'equipment', subtitle: '晶圆、封装及工艺设备', color: 'blue' },
  材料: { key: 'materials', subtitle: '晶圆、化学品与衬底材料', color: 'teal' },
  零部件: { key: 'components', subtitle: '设备零部件与仪器仪表', color: 'amber' }
};

function createSemiconductorProfile() {
  const stageOrder = Object.keys(semiconductorStageMeta);
  const totalRows = semiconductorNodes.reduce((sum, node) => sum + node.rowCount, 0);
  const companyTotal = new Set(semiconductorNodes.flatMap((node) => expandNodeCompanies(node))).size;
  return {
    title: '半导体与集成电路',
    type: '战略性新兴产业',
    industryTypes: ['战略性新兴产业', '传统产业'],
    nodeCount: totalRows,
    total: companyTotal.toLocaleString('zh-CN'),
    tip: '附件将产业链拆分为 8 个一级环节、53 个二级环节和最长六级细分路径；核心环节按原表标注保留。',
    intro: '半导体与集成电路产业链覆盖芯片设计、晶圆制造、封装测试、EDA 与 IP、设备、材料和零部件等关键环节，贯穿从架构设计到制造交付的完整产业协作链条。',
    stages: stageOrder.map((stageName) => {
      const meta = semiconductorStageMeta[stageName];
      const sourceNodes = semiconductorNodes.filter((node) => node.l1 === stageName);
      return {
        ...meta,
        title: stageName,
        count: sourceNodes.length,
        nodes: sourceNodes.map((sourceNode) => ({
          isCore: sourceNode.isCore === true,
          corePaths: Array.isArray(sourceNode.corePaths) ? sourceNode.corePaths : [],
          name: sourceNode.l2,
          meta: `${sourceNode.rowCount} 条层级记录 · ${sourceNode.paths.length} 个细分环节`,
          companyTotal: Number(sourceNode.companyTotal || 0),
          companies: sourceNode.companyTotal.toLocaleString('zh-CN'),
          evidence: sourceNode.isCore ? '核心环节' : '产业配套',
          role: sourceNode.isCore ? '核心环节' : '产业配套',
          featured: sourceNode.isCore === true,
          coreCount: sourceNode.coreCount,
          rowCount: sourceNode.rowCount,
          paths: sourceNode.paths,
          terms: sourceNode.terms,
          companyNames: expandNodeCompanies(sourceNode),
          nodeSearchable: [sourceNode.l1, sourceNode.l2, ...sourceNode.paths, ...sourceNode.terms].join(' '),
          searchable: [sourceNode.l1, sourceNode.l2, ...sourceNode.paths, ...sourceNode.terms, ...expandNodeCompanies(sourceNode)].join(' ')
        }))
      };
    })
  };
}

const simulatedEnterpriseRegions = [
  ['上海市', '上海市浦东新区张江科学城'],
  ['北京市', '北京市海淀区中关村科技园'],
  ['江苏省', '江苏省苏州市工业园区'],
  ['广东省', '广东省深圳市南山区'],
  ['浙江省', '浙江省杭州市滨江区'],
  ['安徽省', '安徽省合肥市高新区'],
  ['湖北省', '湖北省武汉市东湖高新区'],
  ['四川省', '四川省成都市高新区'],
  ['陕西省', '陕西省西安市高新区'],
  ['山东省', '山东省济南市高新区'],
  ['天津市', '天津市滨海新区'],
  ['河北省', '河北省石家庄市高新区'],
  ['山西省', '山西省太原市小店区'],
  ['内蒙古自治区', '内蒙古自治区呼和浩特市科技城'],
  ['辽宁省', '辽宁省沈阳市浑南区'],
  ['吉林省', '吉林省长春市高新区'],
  ['黑龙江省', '黑龙江省哈尔滨市松北区'],
  ['福建省', '福建省厦门市思明区'],
  ['江西省', '江西省南昌市红谷滩区'],
  ['河南省', '河南省郑州市金水区'],
  ['湖南省', '湖南省长沙市岳麓区'],
  ['广西壮族自治区', '广西壮族自治区南宁市高新区'],
  ['海南省', '海南省海口市江东新区'],
  ['重庆市', '重庆市两江新区'],
  ['贵州省', '贵州省贵阳市观山湖区'],
  ['云南省', '云南省昆明市五华区'],
  ['西藏自治区', '西藏自治区拉萨市城关区'],
  ['甘肃省', '甘肃省兰州市城关区'],
  ['青海省', '青海省西宁市城东区'],
  ['宁夏回族自治区', '宁夏回族自治区银川市金凤区'],
  ['新疆维吾尔自治区', '新疆维吾尔自治区乌鲁木齐市高新区']
];

const simulatedEnterpriseRegionPattern = [
  0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5,
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30
];

const simulatedEnterpriseHonors = [
  ['高新技术企业', '专精特新企业', '科技型中小企业'],
  ['制造业单项冠军企业', '高新技术企业'],
  ['百强企业'],
  ['高新技术企业', '科技型中小企业'],
  ['专精特新企业', '小巨人企业'],
  ['科技型中小企业'],
  ['高新技术企业', '专精特新企业'],
  [],
  ['科技型中小企业'],
  ['专精特新企业', '科技型中小企业']
];

const simulatedEnterpriseCapitalPattern = [
  '50 万元', '120 万元', '200 万元', '300 万元', '500 万元',
  '800 万元', '1000 万元', '1500 万元', '3000 万元', '5000 万元',
  '1.2 亿元', '2.5 亿元', '5 亿元', '80 万元'
];

const simulatedFinancingRounds = ['天使轮', 'A轮', 'B轮', 'C轮及以上', '战略融资'];

const simulatedEnterpriseIntellectualPropertyPattern = [
  ['专利信息', '发明授权'],
  ['软件著作权'],
  ['作品著作权'],
  ['商标信息'],
  ['标准信息'],
  ['其他'],
  ['专利信息', '发明申请', '软件著作权'],
  ['专利信息', '实用新型', '商标信息'],
  ['专利信息', '外观专利', '标准信息'],
  ['软件著作权', '作品著作权']
];

function simulateDigits(seedText, count) {
  let hash = 2166136261;
  const text = String(seedText || 'company');
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  let state = hash >>> 0;
  let output = '';
  for (let index = 0; index < count; index += 1) {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    output += (state >>> 16) % 10;
  }
  return output;
}

// 演示样本扩充：每个环节的企业清单补足到统一家数，让抽屉与清单页有更完整的展示量
const COMPANY_SAMPLE_TARGET = 40;

function expandNodeCompanies(node) {
  const names = [...node.companies];
  let extra = 0;
  while (names.length < COMPANY_SAMPLE_TARGET) {
    extra += 1;
    names.push(`${node.l2}样本企业${String(extra).padStart(2, '0')}`);
  }
  return names;
}

function buildSemiconductorCompanyRecords(nodes) {
  let recordIndex = 0;
  return nodes.flatMap((node) => expandNodeCompanies(node).map((name) => {
    const index = recordIndex++;
    const regionIndex = simulatedEnterpriseRegionPattern[(index * 7 + 3) % simulatedEnterpriseRegionPattern.length];
    const [province, baseAddress] = simulatedEnterpriseRegions[regionIndex];
    // 按索引在城市目录中轮换，保证省市下钻排名有分布差异
    const cityOptions = getRegionCities(province);
    const city = cityOptions.length ? cityOptions[index % cityOptions.length] : resolveSimulatedAdministrativeArea(province, baseAddress).city;
    const districtOptions = getRegionDistricts(province, city);
    const district = districtOptions.length ? districtOptions[index % districtOptions.length] : city;
    const address = `${province}${city}${district}`;
    const honors = simulatedEnterpriseHonors[index % simulatedEnterpriseHonors.length];
    const intellectualProperty = simulatedEnterpriseIntellectualPropertyPattern[index % simulatedEnterpriseIntellectualPropertyPattern.length];
    const listed = index % 5 === 0 ? '是' : '否';
    const capital = simulatedEnterpriseCapitalPattern[index % simulatedEnterpriseCapitalPattern.length];
    const foundingYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2017, 2015, 2013, 2010, 2008];
    const year = foundingYears[(index * 5 + 2) % foundingYears.length];
    const month = String((year === 2026 ? index % 9 : index % 12) + 1).padStart(2, '0');
    const day = String((index % 26) + 1).padStart(2, '0');
    const financingEvents = index % 3 === 0 ? 0 : 1 + (index % 4);
    const legalSurnames = ['陈', '李', '王', '张', '刘', '周', '吴', '徐', '孙', '马'];
    const legalGivenNames = ['建华', '志强', '海涛', '晓东', '明辉', '文俊', '立群', '宏伟'];
    const legalPerson = `${legalSurnames[index % legalSurnames.length]}${legalGivenNames[(index * 3) % legalGivenNames.length]}`;
    const phoneCount = index % 7 === 3 ? 0 : 1 + (index % 3);
    const phones = Array.from({ length: phoneCount }, (_, phoneIndex) => (phoneIndex % 2 === 0
      ? `1${3 + (index % 6)}${simulateDigits(`${name}-m${phoneIndex}`, 9)}`
      : `${['010', '021', '022', '023', '025', '028', '029', '0571', '0755', '0512', '027', '0532', '0371', '0851', '0931'][index % 15]}-${simulateDigits(`${name}-t${phoneIndex}`, 8)}`));
    const emailDomain = `wudu${(index % 900) + 100}.com`;
    const emailBoxes = ['contact', 'ir', 'market', 'hr'];
    const emailCount = index % 6 === 5 ? 0 : 1 + (index % 2);
    const emails = Array.from({ length: emailCount }, (_, emailIndex) => `${emailBoxes[emailIndex]}@${emailDomain}`);
    const stockCode = listed === '是' ? `${index % 2 ? '688' : '002'}${String(100 + (index % 899))}.${index % 2 ? 'SH' : 'SZ'}` : '';
    return {
      name,
      displayName: `芯链示范企业${String(index + 1).padStart(2, '0')}`,
      legalPerson,
      phones,
      emails,
      stockCode,
      province,
      city,
      district,
      registeredAddress: address,
      registeredCapital: capital,
      registeredDate: `${year}-${month}-${day}`,
      financingEvents,
      financingRound: financingEvents ? simulatedFinancingRounds[index % simulatedFinancingRounds.length] : '未融资',
      financingAmountWan: financingEvents ? 500 + (index % 9) * 900 : 0,
      operatingStatus: '在营',
      stage: node.l1,
      node: node.l2,
      industryPath: node.paths[0] || '产业链节点',
      type: node.coreCount ? '核心产品企业' : '技术潜力企业',
      evidence: node.coreCount ? '强证据' : '待补证',
      scale: '代表企业',
      honors,
      intellectualProperty,
      listed,
      score: node.coreCount ? 'A1' : 'B',
      detail: `${node.l1} · ${node.l2}${node.paths[0] ? ` · ${node.paths[0]}` : ''}。代表企业来自附件，需结合主体和产品证据进一步核验。`
    };
  }));
}

industryProfiles['半导体与集成电路'] = createSemiconductorProfile();

const nodeCompanies = buildSemiconductorCompanyRecords(semiconductorNodes);

const distribution = [...officialRegionCatalog.reduce((counts, item) => {
  if (/半导体|集成电路/.test(item.coreChains)) counts.set(item.province, (counts.get(item.province) || 0) + 1);
  return counts;
}, new Map())].sort(([, first], [, second]) => second - first);

const mapLocations = {
  北京市: [303, 102], 天津市: [322, 118], 河北省: [276, 139], 山西省: [241, 165], 内蒙古自治区: [234, 88], 辽宁省: [379, 111], 吉林省: [424, 91], 黑龙江省: [480, 62],
  上海市: [435, 227], 江苏省: [404, 204], 浙江省: [418, 256], 安徽省: [365, 230], 福建省: [416, 318], 江西省: [345, 306], 山东省: [354, 170], 河南省: [312, 229],
  湖北省: [310, 278], 湖南省: [322, 321], 广东省: [372, 365], 广西壮族自治区: [298, 368], 海南省: [306, 394], 四川省: [201, 287], 重庆市: [252, 300], 贵州省: [269, 349],
 云南省: [188, 365], 西藏自治区: [74, 354], 陕西省: [238, 245], 甘肃省: [172, 228], 宁夏回族自治区: [200, 187], 青海省: [117, 286], 新疆维吾尔自治区: [45, 197]
};

let chinaMapProjection = null;
let chinaProvinceCenters = new Map();

function collectGeoCoordinates(coordinates, points = []) {
  if (!Array.isArray(coordinates)) return points;
  if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    points.push(coordinates);
    return points;
  }
  coordinates.forEach((item) => collectGeoCoordinates(item, points));
  return points;
}

// 主图只统计陆地部分，南海诸岛（纬度低于 17°）交由左下角内嵌框展示，避免地图被拉扁
const MAINLAND_MIN_LAT = 17;

function createChinaMapProjection(geoJson) {
  const coordinates = geoJson.features.flatMap((feature) => collectGeoCoordinates(feature.geometry?.coordinates))
    .filter(([, latitude]) => latitude >= MAINLAND_MIN_LAT);
  const bounds = {
    minLongitude: Infinity,
    maxLongitude: -Infinity,
    minLatitude: Infinity,
    maxLatitude: -Infinity
  };
  coordinates.forEach(([longitude, latitude]) => {
    bounds.minLongitude = Math.min(bounds.minLongitude, longitude);
    bounds.maxLongitude = Math.max(bounds.maxLongitude, longitude);
    bounds.minLatitude = Math.min(bounds.minLatitude, latitude);
    bounds.maxLatitude = Math.max(bounds.maxLatitude, latitude);
  });
  const width = 880;
  const height = 640;
  const padding = 30;
  // 按中纬度余弦压缩经度，接近常见标准地图的观感
  const midLatitudeRad = ((bounds.minLatitude + bounds.maxLatitude) / 2) * Math.PI / 180;
  const longitudeScale = Math.cos(midLatitudeRad);
  const spanX = (bounds.maxLongitude - bounds.minLongitude) * longitudeScale;
  const spanY = bounds.maxLatitude - bounds.minLatitude;
  const scale = Math.min(
    (width - padding * 2) / spanX,
    (height - padding * 2) / spanY
  );
  const contentWidth = spanX * scale;
  const contentHeight = spanY * scale;
  const offsetX = (width - contentWidth) / 2;
  const offsetY = (height - contentHeight) / 2;
  return ([longitude, latitude]) => ({
    x: offsetX + (longitude - bounds.minLongitude) * longitudeScale * scale,
    y: offsetY + (bounds.maxLatitude - latitude) * scale
  });
}

// 南海诸岛内嵌框：以南海区域为界重新投影，主图省份图形超出部分由 SVG 裁剪
function createSouthSeaProjection() {
  const bounds = { minLongitude: 105.5, maxLongitude: 122.5, minLatitude: 3, maxLatitude: 22.5 };
  const width = 168;
  const height = 200;
  const padding = 8;
  const midLatitudeRad = 12 * Math.PI / 180;
  const longitudeScale = Math.cos(midLatitudeRad);
  const spanX = (bounds.maxLongitude - bounds.minLongitude) * longitudeScale;
  const spanY = bounds.maxLatitude - bounds.minLatitude;
  const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY);
  const contentWidth = spanX * scale;
  const contentHeight = spanY * scale;
  const offsetX = (width - contentWidth) / 2;
  const offsetY = (height - contentHeight) / 2;
  return ([longitude, latitude]) => ({
    x: offsetX + (longitude - bounds.minLongitude) * longitudeScale * scale,
    y: offsetY + (bounds.maxLatitude - latitude) * scale
  });
}

function geoRingToPath(ring, project) {
  return ring.map((coordinate, index) => {
    const point = project(coordinate);
    return `${index ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(' ') + 'Z';
}

function geoGeometryToPath(geometry, project) {
  if (!geometry) return '';
  if (geometry.type === 'Polygon') return geometry.coordinates.map((ring) => geoRingToPath(ring, project)).join(' ');
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap((polygon) => polygon.map((ring) => geoRingToPath(ring, project))).join(' ');
  return '';
}

function renderSouthSeaInset() {
  const target = $('#southSeaPaths');
  const geoJson = window.chinaProvinceGeoJSON;
  if (!target || !geoJson?.features?.length) return;
  const project = createSouthSeaProjection();
  // 内嵌框只画南海周边省份与九段线，其余省份投影后落在框外被裁剪
  const insetFeatureNames = ['海南省', '广东省', '广西壮族自治区', '云南省', '贵州省', '湖南省', '江西省', '福建省', '台湾省', '香港特别行政区', '澳门特别行政区'];
  target.innerHTML = geoJson.features
    .filter((feature) => insetFeatureNames.includes(feature.properties?.name) || feature.properties?.adcode === '100000_JD')
    .map((feature) => {
      const province = feature.properties?.name || '';
      const path = geoGeometryToPath(feature.geometry, project);
      return path ? `<path class="southsea-shape${feature.properties?.adcode === '100000_JD' ? ' southsea-dashline' : ''}" d="${path}"></path>` : '';
    })
    .join('');
}

function renderChinaMapBase() {
  const target = $('#chinaMapPaths');
  const geoJson = window.chinaProvinceGeoJSON;
  if (!target || !geoJson?.features?.length) return;
  chinaMapProjection = createChinaMapProjection(geoJson);
  chinaProvinceCenters = new Map(geoJson.features.map((feature) => [feature.properties?.name, feature.properties?.center || feature.properties?.centroid]).filter(([, center]) => Array.isArray(center)));
  // 九段线只保留在南海诸岛内嵌框中，主图不再绘制
  target.innerHTML = geoJson.features.map((feature) => {
    const province = feature.properties?.name || '';
    if (feature.properties?.adcode === '100000_JD') return '';
    const path = geoGeometryToPath(feature.geometry, chinaMapProjection);
    return path ? `<path class="china-province-shape" data-province="${escapeHtml(province)}" d="${path}"><title>${escapeHtml(province)}</title></path>` : '';
  }).join('');
  $$('.china-province-shape').forEach((path) => path.addEventListener('click', () => selectAnalysisRegion(path.dataset.province)));
  renderSouthSeaInset();
}

const viewMeta = {
  home: ['PRODUCT HOME', '首页', '了解五度智链的数据底座、核心能力与企业上链服务流程。'],
  graph: ['INDUSTRY GRAPH', '产业图谱', '从产业节点到代表企业，查看半导体与集成电路的多级产业链关系。'],
  ai: ['AI RESEARCH AGENT', 'AI智能', '用自然语言查询企业、节点、证据和区域机会，回答会基于当前产业上下文生成。'],
  onchain: ['HOW ENTERPRISES GO ON CHAIN', '上链说明', '上链不是把企业名称放进图谱，而是确认主体、能力、角色和证据边界。'],
  solution: ['INDUSTRY CHAIN SOLUTIONS', '解决方案', '围绕产业链梳理、标准化上链、可视化呈现与数据交付，提供可落地的定制服务。'],
  'company-detail': ['COMPANY PROFILE', '企业详情', '查看企业在链上的位置、工商信息、知识产权、法律诉讼与经营表现。']
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
// 章节标题已并入页签，写入时容忍元素不存在
const setText = (selector, value) => {
  const el = typeof selector === 'string' ? $(selector) : selector;
  if (el) el.textContent = value;
};
let currentIndustry = '半导体与集成电路';
let chainSelectionActive = false;
let currentNode = null;
let currentNodePath = '';
let regionScopeState = { province: '不限', city: '不限', district: '不限' };
let regionScopePickerEventsReady = false;
let toastTimer;

const aiWelcomeMessage = '你好，我可以帮你分析半导体与集成电路的产业链层级、代表企业和省市产业体系。你可以直接问我“哪些环节代表企业最多”或“查看某个省份的官方产业体系”。';
const aiConversations = [
  {
    id: 'conversation-1',
    title: '半导体产业链总览',
    industry: '半导体与集成电路',
    context: '半导体与集成电路 / 全国 31 省市 / 全部企业',
    updated: '刚刚',
    messages: [{ role: 'assistant', text: aiWelcomeMessage }]
  }
];
let activeConversationId = 'conversation-1';

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

function icon(name, className = 'ui-icon') {
  return `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

let customSelectEventsReady = false;

function closeCustomSelect(custom) {
  if (!custom) return;
  custom.menu.classList.remove('open');
  custom.trigger.setAttribute('aria-expanded', 'false');
}

function closeRegionScopePicker() {
  const menu = $('#regionScopeMenu');
  const trigger = $('#regionScopeTrigger');
  menu?.classList.remove('open');
  trigger?.setAttribute('aria-expanded', 'false');
}

function closeAllCustomSelects() {
  $$('.custom-select-host').forEach((host) => closeCustomSelect(host._customSelect));
  closeRegionScopePicker();
}

function positionCustomSelectMenu(custom) {
  if (!custom?.host || !custom.trigger || !custom.menu) return;
  const hostRect = custom.host.getBoundingClientRect();
  const triggerRect = custom.trigger.getBoundingClientRect();
  custom.menu.style.left = `${Math.round(triggerRect.left - hostRect.left)}px`;
  custom.menu.style.width = `${Math.round(triggerRect.width)}px`;
  custom.menu.style.minWidth = `${Math.round(triggerRect.width)}px`;
}

function getMultiSelectValues(select) {
  return [...(select?.options || [])]
    .filter((option) => option.selected)
    .map((option) => option.value);
}

function setMultiSelectValues(select, values = ['不限']) {
  if (!select?.multiple) return;
  const available = new Set([...select.options].map((option) => option.value));
  const nextValues = [...new Set(values)].filter((value) => value !== '不限' && available.has(value));
  const selectedValues = nextValues.length ? new Set(nextValues) : new Set(['不限']);
  [...select.options].forEach((option) => { option.selected = selectedValues.has(option.value); });
}

function getMultiSelectDisplayValues(select) {
  const selectedValues = new Set(getMultiSelectValues(select));
  return getMultiSelectValues(select).filter((value) => {
    const option = [...select.options].find((item) => item.value === value);
    return !option?.dataset.parent || !selectedValues.has(option.dataset.parent);
  });
}

function getMultiSelectLabel(select) {
  const values = getMultiSelectDisplayValues(select).filter((value) => value !== '不限');
  if (!values.length) return '不限';
  const labels = values.map((value) => [...select.options].find((option) => option.value === value)?.textContent || value);
  return labels.length > 2 ? `${labels[0]} 等 ${labels.length} 项` : labels.join('、');
}

function toggleMultiSelectOption(select, value, checked) {
  const selectedValues = new Set(getMultiSelectValues(select).filter((selectedValue) => selectedValue !== '不限'));
  const option = [...select.options].find((item) => item.value === value);
  const childOptions = [...select.options].filter((item) => item.dataset.parent === value);
  if (value === '不限') {
    selectedValues.clear();
  } else if (childOptions.length) {
    if (checked) {
      selectedValues.add(value);
      childOptions.forEach((child) => selectedValues.add(child.value));
    } else {
      selectedValues.delete(value);
      childOptions.forEach((child) => selectedValues.delete(child.value));
    }
  } else if (option?.dataset.parent) {
    if (checked) selectedValues.add(value);
    else selectedValues.delete(value);
    const parent = option.dataset.parent;
    const siblings = [...select.options].filter((item) => item.dataset.parent === parent);
    if (siblings.every((sibling) => selectedValues.has(sibling.value))) selectedValues.add(parent);
    else selectedValues.delete(parent);
  } else if (checked) {
    selectedValues.add(value);
  } else {
    selectedValues.delete(value);
  }
  setMultiSelectValues(select, [...selectedValues]);
  select.dispatchEvent(new Event('input', { bubbles: true }));
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

function syncMultiCustomSelect(select) {
  const custom = select?._customSelect;
  if (!custom) return;
  custom.label.textContent = getMultiSelectLabel(select);
  custom.menu.classList.add('multi-select-menu');
  const selectedValues = new Set(getMultiSelectValues(select));
  custom.menu.replaceChildren(...[...select.options].map((option) => {
    const item = document.createElement('label');
    item.className = 'custom-select-option custom-select-check-option';
    item.dataset.value = option.value;
    item.dataset.level = option.dataset.level || '1';
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(option.selected));
    if (option.dataset.level === '2') item.classList.add('is-suboption');
    if (option.selected) item.classList.add('selected');
    const childOptions = [...select.options].filter((child) => child.dataset.parent === option.value);
    const selectedChildCount = childOptions.filter((child) => selectedValues.has(child.value)).length;
    const isIndeterminate = childOptions.length > 0 && !option.selected && selectedChildCount > 0;
    if (isIndeterminate) {
      item.classList.add('indeterminate');
      item.setAttribute('aria-checked', 'mixed');
    } else {
      item.setAttribute('aria-checked', String(option.selected));
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = option.selected;
    checkbox.indeterminate = isIndeterminate;
    checkbox.setAttribute('aria-label', option.textContent);
    checkbox.addEventListener('change', (event) => {
      event.stopPropagation();
      toggleMultiSelectOption(select, option.value, checkbox.checked);
    });

    const label = document.createElement('span');
    label.className = 'custom-select-option-label';
    label.textContent = option.textContent;
    item.append(checkbox, label);
    return item;
  }));
}

function syncCustomSelect(select) {
  const custom = select?._customSelect;
  if (!custom) return;
  if (select.multiple || select.dataset.multiSelect === 'true') {
    syncMultiCustomSelect(select);
    return;
  }
  const selected = [...select.options].find((option) => option.value === select.value) || select.options[0];
  custom.label.textContent = selected ? selected.textContent : '';
  custom.menu.replaceChildren(...[...select.options].map((option) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'custom-select-option';
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(option.value === select.value));
    const optionCopy = document.createElement('span');
    optionCopy.className = 'custom-select-option-label';
    optionCopy.textContent = option.textContent;
    item.append(optionCopy);
    if (option.dataset.meta) {
      const optionMeta = document.createElement('small');
      optionMeta.className = 'custom-select-option-meta';
      optionMeta.textContent = option.dataset.meta;
      item.append(optionMeta);
    }
    if (option.value === select.value) item.classList.add('selected');
    item.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      select.value = option.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      closeCustomSelect(custom);
    });
    return item;
  }));
}

function syncAdvancedOptionGroup(select) {
  if (!select) return;
  const group = document.querySelector(`[data-filter-options-for="${select.id}"]`);
  if (!group) return;
  group.replaceChildren(...[...select.options].map((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'advanced-option';
    button.dataset.advancedFilterOption = select.id;
    button.dataset.value = option.value;
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(option.value === select.value));
    if (option.value === select.value) button.classList.add('selected');
    const label = document.createElement('span');
    label.textContent = option.textContent;
    button.append(label);
    if (option.dataset.meta) {
      const meta = document.createElement('small');
      meta.textContent = option.dataset.meta;
      button.append(meta);
    }
    return button;
  }));
}

function syncFilterControl(select) {
  syncCustomSelect(select);
  syncAdvancedOptionGroup(select);
}

function enhanceCustomSelects() {
  $$('select').forEach((select) => {
    if (select.classList.contains('advanced-state-select')) {
      syncAdvancedOptionGroup(select);
      return;
    }
    const host = select.parentElement;
    if (!host || host.dataset.customSelectReady === 'true') {
      syncCustomSelect(select);
      return;
    }
    host.dataset.customSelectReady = 'true';
    host.classList.add('custom-select-host');
    select.hidden = true;
    const oldArrow = host.classList.contains('select-box') ? [...host.children].find((child) => child.classList.contains('ui-icon')) : null;
    if (oldArrow) oldArrow.style.display = 'none';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    const label = document.createElement('span');
    label.className = 'custom-select-label';
    const arrow = document.createElement('span');
    arrow.className = 'custom-select-arrow';
    arrow.innerHTML = icon('chevron-down', 'ui-icon mini');
    trigger.append(label, arrow);

    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    menu.setAttribute('role', 'listbox');
    const custom = { trigger, label, menu, host };
    host._customSelect = custom;
    select._customSelect = custom;
    if (oldArrow) host.insertBefore(trigger, oldArrow);
    else host.append(trigger);
    host.append(menu);

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = menu.classList.contains('open');
      closeAllCustomSelects();
      if (!isOpen) {
        syncCustomSelect(select);
        positionCustomSelectMenu(custom);
        menu.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
    select.addEventListener('input', () => syncCustomSelect(select));
    select.addEventListener('change', () => syncCustomSelect(select));
    syncCustomSelect(select);
  });

  if (customSelectEventsReady) return;
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.custom-select-host') && !event.target.closest('#regionScopePicker')) closeAllCustomSelects();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllCustomSelects();
  });
  window.addEventListener('resize', () => {
    $$('.custom-select-menu.open').forEach((menu) => positionCustomSelectMenu(menu.parentElement?._customSelect));
  });
  customSelectEventsReady = true;
}

function setSelectOptions(select, options, placeholder = false) {
  if (!select) return;
  const previous = select.value;
  select.replaceChildren(...options.map(([value, label, meta]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (meta) option.dataset.meta = meta;
    return option;
  }));
  if (placeholder) select.insertAdjacentHTML('afterbegin', '<option value="不限">不限</option>');
  if (![...select.options].some((option) => option.value === previous)) select.value = select.options[0]?.value || '';
  syncFilterControl(select);
}

function getSelectedFilterValues() {
  return {
    type: $('#industryType')?.value || '不限',
    name: $('#industryName')?.value || '不限',
    province: $('#provinceSelect')?.value || '不限',
    area: $('#regionScope')?.value || '不限'
  };
}

function getRegionScopeLabel(state = regionScopeState) {
  return [state.province, state.city, state.district]
    .filter((value) => value && value !== '不限')
    .join(' · ') || '不限';
}

function setRegionScopeState(next, { close = false, apply = true } = {}) {
  const province = next.province || '不限';
  const city = province === '不限' ? '不限' : (next.city || '不限');
  const district = city === '不限' ? '不限' : (next.district || '不限');
  regionScopeState = { province, city, district };
  const label = getRegionScopeLabel();
  const select = $('#regionScope');
  if (select) {
    const option = document.createElement('option');
    option.value = label;
    option.textContent = label;
    option.selected = true;
    select.replaceChildren(option);
  }
  const triggerLabel = $('#regionScopeLabel');
  if (triggerLabel) triggerLabel.textContent = label;
  renderRegionScopeOptions();
  if (apply) select?.dispatchEvent(new Event('change', { bubbles: true }));
  if (close) closeRegionScopePicker();
}

function renderRegionScopeOption(container, level, value, label, selected = false, disabled = false) {
  const option = document.createElement('button');
  option.type = 'button';
  option.className = 'region-cascade-option';
  option.dataset.level = level;
  option.dataset.value = value;
  option.setAttribute('role', 'option');
  option.setAttribute('aria-selected', String(selected));
  option.textContent = label;
  option.disabled = disabled;
  if (selected) option.classList.add('selected');
  if (disabled) option.classList.add('disabled');
  option.addEventListener('click', (event) => {
    event.stopPropagation();
    if (disabled) return;
    if (level === 'province') {
      setRegionScopeState({ province: value, city: '不限', district: '不限' }, { close: value === '不限' });
    } else if (level === 'city') {
      setRegionScopeState({ ...regionScopeState, city: value, district: '不限' });
    } else {
      setRegionScopeState({ ...regionScopeState, district: value }, { close: true });
    }
  });
  container.append(option);
}

function renderRegionScopeOptions() {
  const provinceOptions = $('#regionProvinceOptions');
  const cityOptions = $('#regionCityOptions');
  const districtOptions = $('#regionDistrictOptions');
  if (!provinceOptions || !cityOptions || !districtOptions) return;
  const { province, city, district } = regionScopeState;
  provinceOptions.replaceChildren();
  renderRegionScopeOption(provinceOptions, 'province', '不限', '不限', province === '不限');
  Object.keys(provinceAreaCatalog).forEach((item) => {
    renderRegionScopeOption(provinceOptions, 'province', item, item, province === item);
  });

  cityOptions.replaceChildren();
  if (province === '不限') {
    renderRegionScopeOption(cityOptions, 'city', '', '请先选择省', false, true);
  } else {
    renderRegionScopeOption(cityOptions, 'city', '不限', '全部市', city === '不限');
    getRegionCities(province).forEach((item) => {
      renderRegionScopeOption(cityOptions, 'city', item, item, city === item);
    });
  }

  districtOptions.replaceChildren();
  if (province === '不限') {
    renderRegionScopeOption(districtOptions, 'district', '', '请先选择省', false, true);
  } else if (city === '不限') {
    renderRegionScopeOption(districtOptions, 'district', '', '请先选择市', false, true);
  } else {
    renderRegionScopeOption(districtOptions, 'district', '不限', '全部区', district === '不限');
    getRegionDistricts(province, city).forEach((item) => {
      renderRegionScopeOption(districtOptions, 'district', item, item, district === item);
    });
  }
}

function initializeRegionScopePicker() {
  const picker = $('#regionScopePicker');
  const trigger = $('#regionScopeTrigger');
  const menu = $('#regionScopeMenu');
  if (!picker || !trigger || !menu) return;
  renderRegionScopeOptions();
  if (regionScopePickerEventsReady) return;
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = menu.classList.contains('open');
    closeAllCustomSelects();
    if (isOpen) return;
    renderRegionScopeOptions();
    menu.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#regionScopePicker')) closeRegionScopePicker();
  });
  regionScopePickerEventsReady = true;
}

function resetRegionScopePicker() {
  setRegionScopeState({ province: '不限', city: '不限', district: '不限' }, { close: true, apply: false });
}

function populateRegionScopeOptions() {
  renderRegionScopeOptions();
}

function getCatalogMatches({ includeName = true, includeProvince = true } = {}) {
  const { type, name, province } = getSelectedFilterValues();
  return regionCatalog.filter((region) => {
    if (includeProvince && province !== '不限' && region.province !== province) return false;
    return region.industryEntries.some((entry) => (
      (type === '不限' || entry.types.includes(type)) &&
      (!includeName || industryNameMatches(entry.name, name))
    ));
  });
}

function getAvailableIndustryEntries() {
  const { type, name, province } = getSelectedFilterValues();
  const entries = regionCatalog
    .filter((region) => province === '不限' || region.province === province)
    .flatMap((region) => region.industryEntries)
    .filter((entry) => (type === '不限' || entry.types.includes(type)) && industryNameMatches(entry.name, name));
  const byName = new Map();
  entries.forEach((entry) => {
    const existing = byName.get(entry.name);
    if (existing) existing.types = [...new Set([...existing.types, ...entry.types])];
    else byName.set(entry.name, { ...entry, types: [...entry.types] });
  });
  const orderedEntries = [...byName.values()];
  const integratedCircuitEntry = orderedEntries.find((entry) => entry.name === '集成电路');
  return integratedCircuitEntry
    ? [integratedCircuitEntry, ...orderedEntries.filter((entry) => entry.name !== integratedCircuitEntry.name)]
    : orderedEntries;
}

function getAvailableIndustryNameEntries() {
  const { type } = getSelectedFilterValues();
  return nationalIndustryEntries
    .filter((entry) => type === '不限' || entry.type === type)
    .sort((first, second) => {
      const typeOrder = industryTypeOrder.indexOf(first.type) - industryTypeOrder.indexOf(second.type);
      return typeOrder || first.order - second.order;
    });
}

function populateIndustryNameOptions(preserve = true) {
  const select = $('#industryName');
  if (!select) return;
  const previous = preserve ? select.value : '不限';
  const options = getAvailableIndustryNameEntries().map((entry) => [entry.name, entry.name, entry.type]);
  setSelectOptions(select, [['不限', '不限'], ...options]);
  select.value = options.some(([value]) => value === previous) ? previous : '不限';
  syncFilterControl(select);
}

function getAvailableProvinces() {
  const { type, name } = getSelectedFilterValues();
  return regionCatalog.filter((region) => region.industryEntries.some((entry) => (
    (type === '不限' || entry.types.includes(type)) && industryNameMatches(entry.name, name)
  )));
}

function populateProvinceOptions(preserve = true) {
  const select = $('#provinceSelect');
  if (!select) return;
  const previous = preserve ? select.value : '不限';
  const regions = getAvailableProvinces();
  setSelectOptions(select, [['不限', '不限', '全部省市']].concat(regions.map((region) => [region.province, region.province, region.system])));
  select.value = regions.some((region) => region.province === previous) ? previous : '不限';
  syncFilterControl(select);
}

function getProfile() {
  if (industryProfiles[currentIndustry]) return industryProfiles[currentIndustry];
  const matchedProfile = Object.entries(industryProfiles).find(([name]) => industryNameMatches(name, currentIndustry));
  return matchedProfile?.[1] || null;
}

function ensureCurrentIndustry(entries) {
  const names = entries.map((entry) => entry.name);
  const selectedName = $('#industryName')?.value || '不限';
  if (selectedName !== '不限') {
    const selectedByFilter = names.find((name) => name === selectedName) || names.find((name) => industryNameMatches(name, selectedName));
    if (selectedByFilter) {
      currentIndustry = selectedByFilter;
      return selectedByFilter;
    }
  }
  // 产业类型目录中的 18 条产业链始终允许选中（部分尚未接入图谱明细）
  if (currentIndustry && nationalIndustryEntries.some((entry) => entry.name === currentIndustry)) return currentIndustry;
  if (currentIndustry && names.includes(currentIndustry)) return currentIndustry;
  const matched = names.find((name) => name === currentIndustry || industryNameMatches(name, currentIndustry));
  if (matched) {
    currentIndustry = matched;
    return currentIndustry;
  }
  const fallback = names.find((name) => industryNameMatches(name, '半导体与集成电路')) || names[0] || '';
  currentIndustry = fallback;
  return fallback;
}

function getAllNodes(profile = getProfile()) {
  return profile?.stages?.flatMap((stage) => stage.nodes.map((node) => ({ ...node, stage: stage.title, stageKey: stage.key, color: stage.color }))) || [];
}

function getSearchText() {
  return ($('#graphSearch')?.value || '').trim().toLowerCase();
}

// 搜索框清空按钮：仅在有输入内容时显示
function syncGraphSearchClear() {
  const input = $('#graphSearch');
  const button = $('#clearGraphSearch');
  if (input && button) button.hidden = !input.value.trim();
}

// Search on the chain card list page filters the cards by chain name.
function runGraphSearch() {
  const query = getSearchText();
  renderGraph();
  if (!query) { showToast('已展示全部产业链'); return; }
  const count = $$('#chainPickerGroups .chain-picker-item').length;
  showToast(count ? `已筛选出 ${count} 条匹配产业链` : `未找到与“${query}”匹配的产业链`);
}

function getFilterContext() {
  const province = '不限';
  const region = regionCatalog.find((item) => item.province === province);
  const type = '不限';
  const area = $('#regionScope')?.value || '不限';
  const parts = [];
  if (province === '不限') parts.push('全国 31 省市');
  else parts.push(`${province} · ${region?.system || '官方产业体系'}`);
  if (area !== '不限') parts.push(area);
  if (type !== '不限') parts.push(type);
  return parts.join(' · ');
}

function companyMatchesRegionScope(company) {
  const { province, city, district } = regionScopeState;
  return (province === '不限' || company.province === province) &&
    (city === '不限' || company.city === city) &&
    (district === '不限' || company.district === district);
}

function companyMatchesAdvancedFilters(company) {
  return companyMatchesRegionScope(company);
}

function renderSelectedChain(profile) {
  const title = currentIndustry || '当前产业链';
  $('#selectedChainTitle').textContent = title;
  $('#selectedChainContext').textContent = profile
    ? profile.intro || profile.tip || getFilterContext()
    : `${getFilterContext()} · 仅有官方体系命名`;
  if (!profile) {
    $('#selectedChainStats').innerHTML = '<span><strong>—</strong><small>图谱数据</small></span><span><strong>—</strong><small>企业样本</small></span>';
    return;
  }
  const companyCount = new Set(getVisibleCompanyRecords(profile).map((company) => company.name)).size;
  $('#selectedChainStats').innerHTML = `<span><strong>${profile.stages.length}</strong><small>一级环节</small></span><span><strong>${profile.nodeCount.toLocaleString('zh-CN')}</strong><small>细分环节</small></span><span><strong>${companyCount.toLocaleString('zh-CN')}</strong><small>代表企业</small></span>`;
}

function setChainSelectionMode(selected) {
  chainSelectionActive = selected;
  const pickerPanel = $('#chainSelectorPanel');
  const pickerView = $('#chainPickerView');
  const selectedView = $('#selectedChainView');
  const tabs = $('#workbenchTabs');
  const queryModule = $('.graph-query');
  if (!pickerPanel || !pickerView || !selectedView || !tabs) return;
  pickerPanel.classList.toggle('is-selected', selected);
  document.body.classList.toggle('picker-mode', !selected);
  // The 产业链查询 module only belongs to the chain card list page.
  if (queryModule) queryModule.hidden = selected;
  pickerView.hidden = selected;
  selectedView.hidden = !selected;
  pickerView.setAttribute('aria-hidden', String(selected));
  selectedView.setAttribute('aria-hidden', String(!selected));
  tabs.classList.toggle('is-hidden', !selected);
  if (!selected) {
    $$('.workbench-tab').forEach((tab) => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    $$('.workbench-section').forEach((section) => section.classList.remove('active'));
  }
}

function showChainPicker() {
  setChainSelectionMode(false);
  currentIndustry = '';
  renderGraph();
  $('#chainFilterList')?.focus?.();
}

// Chain selector: the left sidebar always lists the three industry-type
// systems (no tab switching). Selecting a left option scrolls that group
// into view.
const chainFilterState = { tab: 'type', value: '' };

function getChainFilterTabOptions() {
  return industryTypeOrder.map((type) => ({ value: type, label: type, sublabel: '' }));
}

function getChainGroups() {
  const query = getSearchText();
  const matchesQuery = (name) => !query || String(name).toLowerCase().includes(query);
  return industryTypeOrder.map((type) => ({
    value: type,
    label: type,
    sublabel: '',
    entries: nationalIndustryEntries
      .filter((entry) => entry.type === type && matchesQuery(entry.name))
      .map((entry) => ({ name: entry.name, types: [entry.type] }))
  }));
}

// 卡片名称中的搜索关键词高亮
function highlightChainKeyword(name, query) {
  const text = String(name);
  if (!query) return escapeHtml(text);
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return escapeHtml(text);
  return `${escapeHtml(text.slice(0, index))}<mark>${escapeHtml(text.slice(index, index + query.length))}</mark>${escapeHtml(text.slice(index + query.length))}`;
}

// 未接入图谱明细的产业链卡片：按链名确定性生成模拟统计（同链名结果稳定）
function getChainCardMockStats(name) {
  const seed = [...String(name)].reduce((sum, ch) => sum + ch.charCodeAt(0) * 7, 0);
  const nodeCount = 38 + seed % 265;
  const companyCount = 620 + (seed * 13) % 4360;
  return { nodeCount, companyCount };
}

function renderChainCard(entry, selectedIndustry) {
  const entryProfile = industryProfiles[entry.name] || (entry.name === '集成电路' ? industryProfiles['半导体与集成电路'] : null);
  const isSelected = chainSelectionActive && entry.name === selectedIndustry;
  const fmt = (value) => (value === null ? '—' : value.toLocaleString('zh-CN'));
  let nodeCount = null;
  let companyCount = null;
  if (entryProfile) {
    nodeCount = entryProfile.nodeCount;
    companyCount = new Set(getProfileCompanyRecords(entryProfile).map((company) => company.name)).size;
  } else {
    const mock = getChainCardMockStats(entry.name);
    nodeCount = mock.nodeCount;
    companyCount = mock.companyCount;
  }
  return `<button class="chain-picker-item ${isSelected ? 'selected' : ''}" type="button" data-industry="${escapeHtml(entry.name)}" aria-pressed="${isSelected}"><strong class="picker-item-name" title="${escapeHtml(entry.name)}">${highlightChainKeyword(entry.name, getSearchText())}</strong><span class="picker-item-stats"><span>细分环节 <b>${fmt(nodeCount)}</b></span><i aria-hidden="true"></i><span>上链企业 <b>${fmt(companyCount)}</b></span></span></button>`;
}

function renderChainFilterSidebar() {
  const list = $('#chainFilterList');
  if (!list) return;
  const query = getSearchText();
  let options = getChainFilterTabOptions();
  // 搜索时：只保留有匹配产业链的分类选项
  if (query) {
    const matched = new Set(getChainGroups().filter((group) => group.entries.length > 0).map((group) => String(group.value)));
    options = options.filter((option) => matched.has(String(option.value)));
  }
  if (!options.some((option) => option.value === chainFilterState.value)) {
    chainFilterState.value = options[0]?.value || '';
  }
  if (!options.length) {
    list.innerHTML = '<div class="chain-filter-empty">无匹配的分类</div>';
    return;
  }
  list.innerHTML = options.map((option) => {
    const isActive = option.value === chainFilterState.value;
    return `<button class="chain-filter-option ${isActive ? 'active' : ''}" type="button" data-filter-value="${escapeHtml(option.value)}" aria-pressed="${isActive}"><span class="chain-filter-option-copy"><strong>${escapeHtml(option.label)}</strong>${option.sublabel ? `<small>${escapeHtml(option.sublabel)}</small>` : ''}</span></button>`;
  }).join('');
  $$('.chain-filter-option', list).forEach((button) => button.addEventListener('click', () => {
    selectChainFilterOption(button.dataset.filterValue);
  }));
}

$('#chainPickerGroups')?.addEventListener('scroll', handleChainGroupsScroll, { passive: true });

function markActiveChainGroup() {
  $$('#chainPickerGroups .chain-picker-group').forEach((group) => {
    group.classList.toggle('active', group.dataset.groupValue === chainFilterState.value);
  });
}

function scrollToChainGroup(value) {
  const group = $$('#chainPickerGroups .chain-picker-group').find((item) => item.dataset.groupValue === value);
  group?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateChainFilterHighlight() {
  $$('#chainFilterList .chain-filter-option').forEach((option) => {
    const isActive = option.dataset.filterValue === chainFilterState.value;
    option.classList.toggle('active', isActive);
    option.setAttribute('aria-pressed', String(isActive));
  });
  $('#chainFilterList .chain-filter-option.active')?.scrollIntoView({ block: 'nearest' });
}

function selectChainFilterOption(value) {
  chainFilterState.value = value;
  updateChainFilterHighlight();
  markActiveChainGroup();
  suppressChainSpy();
  scrollToChainGroup(value);
}

// Scroll spy: while the right card list is scrolled manually, keep the left
// selection synced to the group whose heading is currently in view.
let chainSpyTicking = false;
// Programmatic scrolls (clicking a left option) must not let the spy flip the
// selection through every passing group; freeze it until the scroll settles.
let chainSpySuppressed = false;
let chainSpyResumeTimer = null;

function resumeChainSpy() {
  chainSpySuppressed = false;
  clearTimeout(chainSpyResumeTimer);
}

function suppressChainSpy() {
  chainSpySuppressed = true;
  clearTimeout(chainSpyResumeTimer);
  chainSpyResumeTimer = setTimeout(resumeChainSpy, 2500);
  const container = $('#chainPickerGroups');
  if (container) {
    container.removeEventListener('scrollend', resumeChainSpy);
    container.addEventListener('scrollend', resumeChainSpy, { once: true });
  }
}

function handleChainGroupsScroll() {
  if (chainSpyTicking) return;
  chainSpyTicking = true;
  requestAnimationFrame(() => {
    chainSpyTicking = false;
    if (chainSpySuppressed) return;
    chainSpyTicking = false;
    const container = $('#chainPickerGroups');
    if (!container) return;
    const groups = $$('#chainPickerGroups .chain-picker-group');
    if (!groups.length) return;
    const containerTop = container.getBoundingClientRect().top;
    let current = groups[0].dataset.groupValue;
    groups.forEach((group) => {
      if (group.getBoundingClientRect().top - containerTop <= 72) current = group.dataset.groupValue;
    });
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 4) {
      current = groups[groups.length - 1].dataset.groupValue;
    }
    if (current && current !== chainFilterState.value) {
      chainFilterState.value = current;
      updateChainFilterHighlight();
      markActiveChainGroup();
    }
  });
}

function renderChainPicker(profile) {
  const entries = getAvailableIndustryEntries();
  const selectedIndustry = chainSelectionActive ? ensureCurrentIndustry(entries) : '';
  setChainSelectionMode(chainSelectionActive);
  renderChainFilterSidebar();
  const groups = getChainGroups();
  const groupsContainer = $('#chainPickerGroups');
  if (groupsContainer) {
    const query = getSearchText();
    const visibleGroups = query ? groups.filter((group) => group.entries.length > 0) : groups;
    if (query && visibleGroups.length === 0) {
      const keyword = ($('#graphSearch')?.value || '').trim();
      groupsContainer.innerHTML = `<div class="chain-picker-empty"><strong>未找到与“${escapeHtml(keyword)}”匹配的产业链</strong><small>请更换关键词重试，或点击搜索框右侧的叉清空关键词查看全部产业链</small></div>`;
    } else {
      groupsContainer.innerHTML = visibleGroups.map((group) => {
        const cards = group.entries.map((entry) => renderChainCard(entry, selectedIndustry)).join('');
        return `<div class="chain-picker-group" data-group-value="${escapeHtml(group.value)}"><div class="chain-picker-group-heading"><strong>${escapeHtml(group.label)}</strong>${group.sublabel ? `<small>${escapeHtml(group.sublabel)}</small>` : ''}<span>${group.entries.length} 条</span></div><div class="chain-picker-group-list">${cards || '<div class="empty-chain-list">该分类下暂无匹配的产业链</div>'}</div></div>`;
      }).join('');
    }
    $$('.chain-picker-item', groupsContainer).forEach((button) => button.addEventListener('click', () => {
      currentIndustry = button.dataset.industry;
      setChainSelectionMode(true);
      renderGraph();
      setWorkbenchSection('graphSection');
    }));
  }
  markActiveChainGroup();
  if (chainSelectionActive) renderSelectedChain(profile);
}

function getCurrentIndustryRegions() {
  const { type, name, province } = getSelectedFilterValues();
  const regions = regionCatalog.filter((region) => {
    if (province !== '不限' && region.province !== province) return false;
    return region.industryEntries.some((entry) => (
      (type === '不限' || entry.types.includes(type)) &&
      (name === '不限' || industryNameMatches(entry.name, name)) &&
      (!currentIndustry || industryNameMatches(entry.name, currentIndustry))
    ));
  });
  return regions.length ? regions : getCatalogMatches();
}

function getProfileCompanyRecords(profile = getProfile()) {
  const nodeNames = new Set(getAllNodes(profile).map((node) => node.name));
  return nodeCompanies.filter((company) => nodeNames.has(company.node));
}

function getVisibleCompanyRecords(profile = getProfile()) {
  if (!profile) return [];
  const query = getSearchText();
  const profileNodes = new Set(getAllNodes(profile).map((node) => node.name));
  return getProfileCompanyRecords(profile).filter((company) => (
    profileNodes.has(company.node) &&
    (!query || `${company.name}${company.displayName || ''}${company.node}${company.detail}`.toLowerCase().includes(query)) &&
    companyMatchesAdvancedFilters(company)
  ));
}

function getNodeVisibleCompanyCount(node) {
  return new Set(nodeCompanies
    .filter((company) => company.node === node.name && companyMatchesAdvancedFilters(company))
    .map((company) => company.name)).size;
}

/* ===================== 环节判断（优势 / 弱势 / 断链） ===================== */
const NODE_STATUS_META = {
  advantage: { label: '优势环节', className: 'advantage', note: '上链企业数量高于链条平均水平，环节相对成熟' },
  weak: { label: '弱势环节', className: 'weak', note: '上链企业数量低于链条平均水平，环节支撑相对薄弱' },
  break: { label: '断链环节', className: 'break', note: '暂未发现上链企业，存在断链风险，可作为引育补链的重点方向' }
};

function getNodeRawCompanyCount(node) {
  return new Set(nodeCompanies.filter((company) => company.node === node.name).map((company) => company.name)).size;
}

// 基于当前产业链全量样本统计环节判断：
// 无企业 → 断链；低于链条非零环节平均 → 弱势；其余 → 优势。
function buildNodeStatusIndex(profile = getProfile()) {
  const nodes = getAllNodes(profile);
  const counts = nodes.map((node) => ({ node, count: getNodeRawCompanyCount(node) }));
  const nonZeroCounts = counts.filter((item) => item.count > 0).map((item) => item.count);
  const average = nonZeroCounts.length ? nonZeroCounts.reduce((sum, value) => sum + value, 0) / nonZeroCounts.length : 0;
  const index = new Map();
  counts.forEach((item) => {
    const key = item.count === 0 ? 'break' : item.count < average ? 'weak' : 'advantage';
    index.set(item.node.name, { key, count: item.count, average });
  });
  return index;
}

function getNodeStatus(nodeName, statusIndex = null) {
  const entry = statusIndex?.get(nodeName);
  if (entry) return entry;
  const count = getNodeRawCompanyCount({ name: nodeName });
  return { key: count === 0 ? 'break' : 'advantage', count, average: 0 };
}

function renderPopoverTrigger(label, title, items = []) {
  const data = items.map((item) => escapeHtml(item)).join('|');
  return `<span class="cell-popover-trigger" tabindex="0" data-popover-title="${escapeHtml(title)}" data-popover-items="${data}">${label}</span>`;
}

function renderContactCell(values = []) {
  if (!values.length) return '<span class="cell-empty">—</span>';
  const first = escapeHtml(values[0]);
  const hasMore = values.length > 1;
  const kind = values.some((value) => value.includes('@')) ? '邮箱' : '电话';
  const attrs = hasMore
    ? ` tabindex="0" data-popover-title="全部${kind}" data-popover-items="${values.map((value) => escapeHtml(value)).join('|')}"`
    : '';
  const firstHtml = hasMore
    ? `<span class="cell-popover-trigger" title="${first}"${attrs}>${first}</span>`
    : `<span class="cell-contact-value" title="${first}">${first}</span>`;
  const moreHtml = hasMore
    ? `<button type="button" class="cell-more cell-popover-trigger"${attrs}>+${values.length - 1}</button>`
    : '';
  return `<div class="cell-contact">${firstHtml}${moreHtml}</div>`;
}

/* ===================== 上链企业清单：筛选 / 导出 ===================== */
// group: primary 常驻首行（地区 / 环节），advanced 收进「更多筛选」
const COMPANY_FILTER_CONFIG = [
  { key: 'region', label: '所属地区', group: 'primary', empty: '全部地区', mode: 'multi', tree: true, searchable: true, searchHint: '搜索省 / 市 / 区县' },
  { key: 'node', label: '产业链环节', group: 'primary', empty: '全部环节', mode: 'multi', tree: true, searchable: true, searchHint: '搜索环节 / 节点 / 路径' },
  { key: 'listed', label: '是否上市', group: 'advanced', empty: '不限', mode: 'single', options: [['all', '不限'], ['yes', '已上市'], ['no', '未上市']] },
  { key: 'honor', label: '企业荣誉', group: 'advanced', empty: '全部', mode: 'multi', searchable: true, searchHint: '搜索荣誉名称' },
  { key: 'phone', label: '联系电话', group: 'advanced', empty: '不限', mode: 'single', options: [['all', '不限'], ['yes', '有联系电话'], ['no', '无联系电话']] },
  { key: 'email', label: '联系邮箱', group: 'advanced', empty: '不限', mode: 'single', options: [['all', '不限'], ['yes', '有联系邮箱'], ['no', '无联系邮箱']] },
  {
    key: 'found', label: '成立日期', group: 'advanced', empty: '不限', mode: 'multi',
    options: [['lt3m', '3 个月内'], ['lt6m', '半年内'], ['lt1y', '1 年内'], ['y1_3', '1-3 年'], ['y3_5', '3-5 年'], ['y5_10', '5-10 年'], ['gt10', '10 年以上']]
  },
  {
    key: 'capital', label: '注册资本', group: 'advanced', empty: '不限', mode: 'multi',
    options: [['lt100', '100 万以内'], ['b100_200', '100-200 万'], ['b200_500', '200-500 万'], ['b500_1000', '500-1000 万'], ['b1000_5000', '1000-5000 万'], ['gt5000', '5000 万以上']]
  }
];

function createCompanyFilterState() {
  return {
    region: new Set(),
    node: new Set(),
    honor: new Set(),
    found: new Set(),
    capital: new Set(),
    listed: 'all',
    phone: 'all',
    email: 'all'
  };
}

// 筛选上下文：上链企业清单（list）与产业环节侧边栏（drawer）各持一份独立状态
const COMPANY_FILTER_SCOPES = {
  list: { state: createCompanyFilterState(), options: {}, optionsSource: '', advancedOpen: true, treeExpanded: { region: new Set(), node: new Set() } },
  drawer: { state: createCompanyFilterState(), options: {}, optionsSource: '', advancedOpen: true, treeExpanded: { region: new Set(), node: new Set() } }
};
let companyFilterEventsReady = false;

function filterCtx(scope = 'list') {
  return COMPANY_FILTER_SCOPES[scope] || COMPANY_FILTER_SCOPES.list;
}

function filterRoot(scope = 'list') {
  return document.querySelector(`.company-filter-bar[data-filter-scope="${scope}"]`);
}

// 抽屉里的筛选项基于当前环节企业，清单基于整条产业链
function getFilterSourceRecords(scope = 'list') {
  if (scope === 'drawer') return getDrawerNodeRecords();
  return getProfileCompanyRecords(getProfile());
}

function getCapitalInWan(company) {
  const text = String(company?.registeredCapital || '');
  const value = Number.parseFloat(text.replace(/,/g, ''));
  if (!Number.isFinite(value)) return 0;
  return text.includes('亿') ? value * 10000 : value;
}

function getCapitalBucketKey(company) {
  const wan = getCapitalInWan(company);
  if (wan < 100) return 'lt100';
  if (wan < 200) return 'b100_200';
  if (wan < 500) return 'b200_500';
  if (wan < 1000) return 'b500_1000';
  if (wan < 5000) return 'b1000_5000';
  return 'gt5000';
}

function getFoundedBucketKey(company) {
  const time = Date.parse(`${company?.registeredDate || ''}T00:00:00`);
  if (!Number.isFinite(time)) return '';
  const months = (Date.now() - time) / (1000 * 60 * 60 * 24 * 30.44);
  if (months < 0) return '';
  if (months <= 3) return 'lt3m';
  if (months <= 6) return 'lt6m';
  if (months <= 12) return 'lt1y';
  if (months <= 36) return 'y1_3';
  if (months <= 60) return 'y3_5';
  if (months <= 120) return 'y5_10';
  return 'gt10';
}

function getCompanyNodeMap(records = []) {
  const map = new Map();
  records.forEach((company) => {
    if (!map.has(company.name)) map.set(company.name, new Set());
    map.get(company.name).add(company.node);
  });
  return map;
}

// 一家企业可命中的地区路径：省、省/市、省/市/区，选任一层级都能筛到它
function companyRegionPaths(company) {
  const paths = [];
  if (company.province) paths.push(company.province);
  if (company.province && company.city) paths.push(`${company.province}/${company.city}`);
  if (company.province && company.city && company.district) paths.push(`${company.province}/${company.city}/${company.district}`);
  return paths;
}

// 一家企业可命中的环节路径：一级环节、二级节点、三级细分路径
function companyNodePaths(company) {
  const paths = [];
  if (company.stage) paths.push(company.stage);
  if (company.stage && company.node) paths.push(`${company.stage}/${company.node}`);
  if (company.stage && company.node && company.industryPath) paths.push(`${company.stage}/${company.node}/${company.industryPath}`);
  return paths;
}

function clearCompanyFilter(key, scope = 'list') {
  const state = filterCtx(scope).state;
  if (state[key] instanceof Set) state[key].clear();
  else state[key] = 'all';
}

function hasActiveCompanyFilters(scope = 'list') {
  const state = filterCtx(scope).state;
  return COMPANY_FILTER_CONFIG.some((filter) => {
    const value = state[filter.key];
    return value instanceof Set ? value.size > 0 : value !== 'all';
  });
}

function companyMatchesCompanyFilters(company, scope = 'list') {
  const { region, node, honor, found, capital, listed, phone, email } = filterCtx(scope).state;
  if (region.size && !companyRegionPaths(company).some((path) => region.has(path))) return false;
  if (node.size && !companyNodePaths(company).some((path) => node.has(path))) return false;
  if (listed !== 'all' && (company.listed === '是') !== (listed === 'yes')) return false;
  if (honor.size && !(company.honors || []).some((item) => honor.has(item))) return false;
  if (phone !== 'all' && ((company.phones || []).length > 0) !== (phone === 'yes')) return false;
  if (email !== 'all' && ((company.emails || []).length > 0) !== (email === 'yes')) return false;
  if (found.size && !found.has(getFoundedBucketKey(company))) return false;
  if (capital.size && !capital.has(getCapitalBucketKey(company))) return false;
  return true;
}

/* ---------- 树形筛选项构建：地区三级、环节三级 ---------- */
function buildFilterTree(records, getLevels) {
  const roots = new Map();
  records.forEach((company) => {
    const levels = getLevels(company).filter((label) => Boolean(label) && label !== '不限');
    if (!levels.length) return;
    let bucket = roots;
    let path = '';
    levels.forEach((label, index) => {
      path = path ? `${path}/${label}` : label;
      let entry = bucket.get(path);
      if (!entry) {
        entry = { value: path, label, level: index, count: 0, children: new Map(), names: new Set() };
        bucket.set(path, entry);
      }
      // 按企业名去重，和列表里的企业总数口径保持一致
      entry.names.add(company.name);
      entry.count = entry.names.size;
      bucket = entry.children;
    });
  });
  const toArray = (map) => [...map.values()]
    .map(({ names, ...entry }) => ({ ...entry, children: toArray(entry.children) }))
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label, 'zh-Hans-CN'));
  return toArray(roots);
}

function flattenFilterTree(nodes, parentLabel = '') {
  const result = [];
  nodes.forEach((node) => {
    // 直辖市的省、市同名，展示时合并成「上海市 / 浦东新区」
    const segments = parentLabel ? [...parentLabel.split(' / '), node.label] : [node.label];
    const compact = segments.filter((segment, index) => segment !== segments[index - 1]);
    const fullLabel = compact.join(' / ');
    result.push({ value: node.value, label: node.label, level: node.level, count: node.count, fullLabel, children: node.children });
    if (node.children.length) result.push(...flattenFilterTree(node.children, fullLabel));
  });
  return result;
}

function buildCompanyFilterOptions(sourceRecords) {
  const records = Array.isArray(sourceRecords) ? sourceRecords : [];
  const countBy = (getter) => {
    const counter = new Map();
    records.forEach((company) => {
      const values = [].concat(getter(company) || []).filter(Boolean);
      values.forEach((value) => {
        if (!counter.has(value)) counter.set(value, new Set());
        counter.get(value).add(company.name);
      });
    });
    return [...counter.entries()]
      .sort((a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0], 'zh-Hans-CN'))
      .map(([value, names]) => [value, value, names.size]);
  };
  const buckets = (getter, options) => options.map(([value, label]) => {
    const count = new Set(records.filter((company) => getter(company) === value).map((company) => company.name)).size;
    return [value, label, count];
  });
  const foundFilter = COMPANY_FILTER_CONFIG.find((filter) => filter.key === 'found');
  const capitalFilter = COMPANY_FILTER_CONFIG.find((filter) => filter.key === 'capital');
  const regionTree = buildFilterTree(records, (company) => [company.province, company.city, company.district]);
  const nodeTree = buildFilterTree(records, (company) => [company.stage, company.node, company.industryPath]);
  const indexTree = (nodes, map) => nodes.forEach((node) => { map.set(node.value, node); indexTree(node.children, map); });
  const regionIndex = new Map();
  const nodeIndex = new Map();
  indexTree(regionTree, regionIndex);
  indexTree(nodeTree, nodeIndex);
  return {
    regionIndex,
    nodeIndex,
    regionTree,
    regionFlat: flattenFilterTree(regionTree),
    nodeTree,
    nodeFlat: flattenFilterTree(nodeTree),
    honor: countBy((company) => company.honors || []),
    found: buckets(getFoundedBucketKey, foundFilter.options),
    capital: buckets(getCapitalBucketKey, capitalFilter.options),
    listed: [['all', '不限', new Set(records.map((company) => company.name)).size], ['yes', '已上市', new Set(records.filter((company) => company.listed === '是').map((company) => company.name)).size], ['no', '未上市', new Set(records.filter((company) => company.listed !== '是').map((company) => company.name)).size]],
    phone: [['all', '不限', new Set(records.map((company) => company.name)).size], ['yes', '有联系电话', new Set(records.filter((company) => (company.phones || []).length).map((company) => company.name)).size], ['no', '无联系电话', new Set(records.filter((company) => !(company.phones || []).length).map((company) => company.name)).size]],
    email: [['all', '不限', new Set(records.map((company) => company.name)).size], ['yes', '有联系邮箱', new Set(records.filter((company) => (company.emails || []).length).map((company) => company.name)).size], ['no', '无联系邮箱', new Set(records.filter((company) => !(company.emails || []).length).map((company) => company.name)).size]]
  };
}

function getCompanyFilterOptions(filter, scope = 'list') {
  const options = filterCtx(scope).options;
  if (filter.tree) return options[`${filter.key}Flat`] || [];
  if (filter.options) return options[filter.key] || filter.options;
  return options[filter.key] || [];
}

function getFilterOptionLabel(filter, value, scope = 'list') {
  if (filter.tree) {
    const found = (filterCtx(scope).options[`${filter.key}Flat`] || []).find((item) => item.value === value);
    if (found) return found.fullLabel;
    return String(value).split('/').join(' / ');
  }
  const tuple = (filter.options || []).find(([item]) => item === value);
  return tuple ? tuple[1] : value;
}

function renderCompanyFilterOption(filter, value, label, count, extra = {}, scope = 'list') {
  const state = filterCtx(scope).state[filter.key];
  const checked = state instanceof Set ? state.has(value) : state === value;
  const classes = ['filter-option'];
  if (checked) classes.push('is-checked');
  if (extra.partial) classes.push('is-partial');
  return `<button type="button" class="${classes.join(' ')}" data-filter-option="${filter.key}" data-value="${escapeHtml(value)}" role="option" aria-selected="${checked}" title="${escapeHtml(extra.title || label)}"><span class="filter-option-box" aria-hidden="true"></span><span class="filter-option-label">${escapeHtml(label)}</span><em class="filter-option-count">${count}</em></button>`;
}

function getFilterTreeExpanded(key, scope = 'list') {
  const ctx = filterCtx(scope);
  if (!ctx.treeExpanded[key]) ctx.treeExpanded[key] = new Set();
  return ctx.treeExpanded[key];
}

function hasCheckedDescendant(filter, node, scope = 'list') {
  const state = filterCtx(scope).state[filter.key];
  return (node.children || []).some((child) => state.has(child.value) || hasCheckedDescendant(filter, child, scope));
}

function renderFilterTreeRow(filter, node, displayLabel, displayLevel = node.level, scope = 'list') {
  const expanded = getFilterTreeExpanded(filter.key, scope);
  const isOpen = expanded.has(node.value);
  const hasChildren = (node.children || []).length > 0;
  const toggle = hasChildren
    ? `<button type="button" class="filter-tree-toggle${isOpen ? ' is-open' : ''}" data-tree-toggle="${filter.key}" data-value="${escapeHtml(node.value)}" aria-label="${isOpen ? '收起下级' : '展开下级'}" aria-expanded="${isOpen}"></button>`
    : '<span class="filter-tree-toggle is-empty" aria-hidden="true"></span>';
  const partial = !filterCtx(scope).state[filter.key].has(node.value) && hasCheckedDescendant(filter, node, scope);
  return `<div class="filter-tree-row" data-level="${displayLevel}">${toggle}${renderCompanyFilterOption(filter, node.value, displayLabel, node.count, { partial, title: String(node.value).split('/').join(' / ') }, scope)}</div>`;
}

function renderFilterTree(filter, keyword = '', scope = 'list') {
  const options = filterCtx(scope).options;
  const text = String(keyword || '').trim().toLowerCase();
  if (text) {
    // 搜索时平铺展示命中的省 / 市 / 区县或环节 / 节点 / 路径，并带上完整层级名
    const matched = (options[`${filter.key}Flat`] || [])
      .filter((item) => item.fullLabel.toLowerCase().includes(text) || item.label.toLowerCase().includes(text));
    if (!matched.length) return '<div class="filter-option-empty">没有匹配的项</div>';
    // 精确 / 前缀命中优先，其次按层级由高到低，再按企业数排序
    return matched
      .map((item) => {
        const label = item.label.toLowerCase();
        const score = label === text ? 0 : label.startsWith(text) ? 1 : label.includes(text) ? 2 : 3;
        return { item, score };
      })
      .sort((first, second) => first.score - second.score || first.item.level - second.item.level || second.item.count - first.item.count)
      .map(({ item }) => renderFilterTreeRow(filter, item, item.fullLabel, -1, scope))
      .join('');
  }
  const renderLevel = (nodes, parentLabel = '') => nodes.map((node) => {
    // 直辖市省、市同名时，市级显示为「XX（全市）」以便区分层级
    const label = parentLabel && node.label === parentLabel ? `${node.label}（全市）` : node.label;
    const row = renderFilterTreeRow(filter, node, label, node.level, scope);
    const isOpen = getFilterTreeExpanded(filter.key, scope).has(node.value);
    const children = isOpen && node.children.length ? renderLevel(node.children, node.label) : '';
    return row + children;
  }).join('');
  return renderLevel(options[`${filter.key}Tree`] || []) || '<div class="filter-option-empty">暂无可选内容</div>';
}

function renderCompanyFilterPanel(filter, scope = 'list') {
  const search = filter.searchable
    ? `<div class="filter-panel-search"><svg class="ui-icon mini"><use href="#icon-search"></use></svg><input type="search" data-filter-search="${filter.key}" placeholder="${escapeHtml(filter.searchHint || '搜索')}"/></div>`
    : '';
  const body = filter.tree
    ? renderFilterTree(filter, '', scope)
    : (getCompanyFilterOptions(filter, scope).map(([value, label, count]) => renderCompanyFilterOption(filter, value, label, count, {}, scope)).join('') || '<div class="filter-option-empty">暂无可选内容</div>');
  return `<div class="filter-drop-panel${filter.tree ? ' is-tree' : ''}" data-filter-panel="${filter.key}" hidden>${search}<div class="filter-option-list" data-filter-list="${filter.key}">${body}</div><div class="filter-panel-foot"><button type="button" class="filter-panel-reset" data-filter-reset="${filter.key}">重置</button><button type="button" class="filter-panel-done" data-filter-done="${filter.key}">完成</button></div></div>`;
}

function refreshFilterPanel(key, scope = 'list') {
  const filter = COMPANY_FILTER_CONFIG.find((item) => item.key === key);
  const panel = filterRoot(scope)?.querySelector(`[data-filter-panel="${key}"]`);
  const list = panel?.querySelector('[data-filter-list]');
  if (!filter || !list) return;
  if (filter.tree) {
    const keyword = panel.querySelector('input[type="search"]')?.value || '';
    list.innerHTML = renderFilterTree(filter, keyword, scope);
    return;
  }
  list.innerHTML = getCompanyFilterOptions(filter, scope).map(([value, label, count]) => renderCompanyFilterOption(filter, value, label, count, {}, scope)).join('') || '<div class="filter-option-empty">暂无可选内容</div>';
}

function getCompanyFilterValueLabel(filter, scope = 'list') {
  const state = filterCtx(scope).state[filter.key];
  if (!(state instanceof Set)) {
    const option = (filter.options || []).find(([value]) => value === state);
    return option ? option[1] : filter.empty;
  }
  if (!state.size) return filter.empty;
  const labels = [...state].map((value) => getFilterOptionLabel(filter, value, scope));
  return labels.length > 2 ? `${labels.slice(0, 2).join('、')} 等 ${labels.length} 项` : labels.join('、');
}

function syncCompanyFilterTriggers(scope = 'list') {
  const bar = filterRoot(scope);
  if (!bar) return;
  const state = filterCtx(scope).state;
  COMPANY_FILTER_CONFIG.forEach((filter) => {
    const valueLabel = bar.querySelector(`[data-filter-value="${filter.key}"]`);
    const text = getCompanyFilterValueLabel(filter, scope);
    if (valueLabel) valueLabel.textContent = text;
    const trigger = bar.querySelector(`[data-filter-trigger="${filter.key}"]`);
    const current = state[filter.key];
    const active = current instanceof Set ? current.size > 0 : current !== 'all';
    trigger?.classList.toggle('is-active', active);
    trigger?.setAttribute('title', `${filter.label}：${text}`);
  });
  syncCompanyAdvancedState(scope);
}

// 「更多筛选」按钮：收起时用角标提示还有多少个高级条件在生效
function getAdvancedFilterActiveCount(scope = 'list') {
  const state = filterCtx(scope).state;
  return COMPANY_FILTER_CONFIG.filter((filter) => filter.group !== 'primary').reduce((sum, filter) => {
    const current = state[filter.key];
    if (current instanceof Set) return sum + current.size;
    return sum + (current !== 'all' ? 1 : 0);
  }, 0);
}

function syncCompanyAdvancedState(scope = 'list') {
  const root = filterRoot(scope);
  if (!root) return;
  const advanced = root.querySelector('[data-filter-advanced]');
  const toggle = root.querySelector('[data-advanced-toggle]');
  const count = root.querySelector('[data-advanced-count]');
  if (!advanced || !toggle) return;
  const ctx = filterCtx(scope);
  const activeCount = getAdvancedFilterActiveCount(scope);
  if (count) {
    count.textContent = String(activeCount);
    count.hidden = activeCount === 0;
  }
  advanced.hidden = !ctx.advancedOpen;
  toggle.classList.toggle('is-active', activeCount > 0);
  toggle.classList.toggle('is-open', ctx.advancedOpen);
  toggle.setAttribute('aria-expanded', String(ctx.advancedOpen));
}

function syncCompanyFilterOptionStates(scope = 'list') {
  const root = filterRoot(scope);
  if (!root) return;
  const state = filterCtx(scope).state;
  root.querySelectorAll('[data-filter-option]').forEach((option) => {
    const key = option.dataset.filterOption;
    const current = state[key];
    if (!current) return;
    const checked = current instanceof Set ? current.has(option.dataset.value) : current === option.dataset.value;
    option.classList.toggle('is-checked', checked);
    option.setAttribute('aria-selected', String(checked));
    const filter = COMPANY_FILTER_CONFIG.find((item) => item.key === key);
    if (filter?.tree) {
      const node = filterCtx(scope).options[`${key}Index`]?.get(option.dataset.value);
      option.classList.toggle('is-partial', Boolean(node) && !checked && hasCheckedDescendant(filter, node, scope));
    }
  });
}

function renderCompanyFilterItem(filter, scope = 'list') {
  return `<div class="filter-dropdown" data-filter="${filter.key}"><button type="button" class="filter-drop-trigger" data-filter-trigger="${filter.key}" aria-haspopup="listbox" aria-expanded="false"><span class="filter-drop-name">${filter.label}</span><b class="filter-drop-value" data-filter-value="${filter.key}">${escapeHtml(getCompanyFilterValueLabel(filter, scope))}</b><i class="filter-drop-caret" aria-hidden="true"></i></button>${renderCompanyFilterPanel(filter, scope)}</div>`;
}

// 清单与侧边栏共用同一套筛选组件，各自维护 DOM（data-filter-scope）与状态
function renderCompanyFilterBar(scope = 'list') {
  const root = filterRoot(scope);
  if (!root) return;
  const groups = root.querySelector('[data-filter-groups]');
  const advanced = root.querySelector('[data-filter-advanced]');
  if (!groups || !advanced) return;
  const ctx = filterCtx(scope);
  const records = getFilterSourceRecords(scope);
  const source = scope === 'drawer'
    ? `${currentNode?.name || ''}|${currentNodePath}|${records.length}`
    : `${getProfile()?.title || ''}|${getProfile()?.nodeCount || 0}|${records.length}`;
  if (ctx.optionsSource === source && groups.childElementCount && advanced.childElementCount) {
    syncCompanyFilterTriggers(scope);
    return;
  }
  ctx.optionsSource = source;
  ctx.options = buildCompanyFilterOptions(records);
  ctx.treeExpanded.region = new Set();
  ctx.treeExpanded.node = new Set();
  groups.innerHTML = COMPANY_FILTER_CONFIG.filter((filter) => filter.group === 'primary').map((filter) => renderCompanyFilterItem(filter, scope)).join('');
  advanced.innerHTML = COMPANY_FILTER_CONFIG.filter((filter) => filter.group !== 'primary').map((filter) => renderCompanyFilterItem(filter, scope)).join('');
  syncCompanyFilterTriggers(scope);
}

function renderCompanyFilterChips(scope = 'list') {
  const chips = document.querySelector(`[data-filter-chips="${scope}"]`);
  if (!chips) return;
  const state = filterCtx(scope).state;
  const items = [];
  COMPANY_FILTER_CONFIG.forEach((filter) => {
    const current = state[filter.key];
    if (current instanceof Set) {
      [...current].forEach((value) => {
        const label = getFilterOptionLabel(filter, value, scope);
        items.push(`<span class="filter-chip">${escapeHtml(filter.label)}：${escapeHtml(label)}<button type="button" class="filter-chip-close" data-filter-remove="${filter.key}" data-value="${escapeHtml(value)}" aria-label="移除该筛选">×</button></span>`);
      });
    } else if (current !== 'all') {
      const option = (filter.options || []).find(([value]) => value === current);
      items.push(`<span class="filter-chip">${escapeHtml(filter.label)}：${escapeHtml(option ? option[1] : current)}<button type="button" class="filter-chip-close" data-filter-remove="${filter.key}" data-value="${current}" aria-label="移除该筛选">×</button></span>`);
    }
  });
  chips.hidden = !items.length;
  chips.innerHTML = items.length ? `${items.join('')}<button type="button" class="filter-chip-clear" data-clear-filter-chips="${scope}">清空全部</button>` : '';
}

function closeCompanyFilterPanels(exceptKey, scope = '') {
  const roots = scope ? [filterRoot(scope)].filter(Boolean) : [...document.querySelectorAll('.company-filter-bar[data-filter-scope]')];
  roots.forEach((root) => {
    root.querySelectorAll('.filter-drop-panel').forEach((panel) => {
      if (exceptKey && panel.dataset.filterPanel === exceptKey) return;
      panel.hidden = true;
      panel.closest('.filter-dropdown')?.querySelector('.filter-drop-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });
}

function applyCompanyFilters(scope = 'list') {
  renderCompanyFilterBar(scope);
  syncCompanyFilterTriggers(scope);
  syncCompanyFilterOptionStates(scope);
  renderCompanyFilterChips(scope);
  if (scope === 'drawer') {
    // 勾选后重建卡片列表，保持原滚动位置，避免视图跳回顶部
    const board = document.getElementById('drawerCompanyList');
    const top = board ? board.scrollTop : 0;
    renderDrawerCompanies();
    if (board) board.scrollTop = top;
    return;
  }
  renderCompanyList();
}

// 选中子级时把它的上级展开，避免选中项藏在折叠分支里
function ensureTreeAncestors(key, value, scope = 'list') {
  const expanded = getFilterTreeExpanded(key, scope);
  const segments = String(value).split('/');
  let path = '';
  let changed = false;
  segments.slice(0, -1).forEach((segment) => {
    path = path ? `${path}/${segment}` : segment;
    if (!expanded.has(path)) {
      expanded.add(path);
      changed = true;
    }
  });
  return changed;
}

function toggleCompanyFilterOption(key, value, scope = 'list') {
  const filter = COMPANY_FILTER_CONFIG.find((item) => item.key === key);
  if (!filter) return;
  const state = filterCtx(scope).state;
  const current = state[key];
  if (current instanceof Set) {
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
      // 层级互斥：选中子级时去掉已被覆盖的上级，选中上级时去掉其下所有子级
      if (filter.tree) {
        const segments = String(value).split('/');
        let path = '';
        segments.slice(0, -1).forEach((segment) => {
          path = path ? `${path}/${segment}` : segment;
          current.delete(path);
        });
        [...current].forEach((item) => {
          if (item !== value && item.startsWith(`${value}/`)) current.delete(item);
        });
      }
    }
  } else {
    state[key] = value;
  }
  applyCompanyFilters(scope);
  if (filter.tree && current instanceof Set && current.has(value) && ensureTreeAncestors(key, value, scope)) {
    refreshFilterPanel(key, scope);
  }
  if (filter.mode === 'single') closeCompanyFilterPanels('', scope);
}

function eventFilterScope(event) {
  const root = event.target.closest('[data-filter-scope]');
  return root?.dataset.filterScope || 'list';
}

function initCompanyFilters() {
  renderCompanyFilterBar('list');
  renderCompanyFilterChips('list');
  renderCompanyFilterBar('drawer');
  renderCompanyFilterChips('drawer');
  if (companyFilterEventsReady) return;
  companyFilterEventsReady = true;
  document.addEventListener('click', (event) => {
    const advancedToggle = event.target.closest('[data-advanced-toggle]');
    if (advancedToggle) {
      const scope = advancedToggle.dataset.advancedToggle || 'list';
      const ctx = filterCtx(scope);
      ctx.advancedOpen = !ctx.advancedOpen;
      if (!ctx.advancedOpen) closeCompanyFilterPanels('', scope);
      syncCompanyAdvancedState(scope);
      return;
    }
    const trigger = event.target.closest('[data-filter-trigger]');
    if (trigger) {
      const scope = eventFilterScope(event);
      const key = trigger.dataset.filterTrigger;
      const panel = trigger.parentElement.querySelector(`[data-filter-panel="${key}"]`);
      const willOpen = panel?.hidden;
      closeCompanyFilterPanels(key, scope);
      if (panel) panel.hidden = !willOpen;
      trigger.setAttribute('aria-expanded', String(Boolean(willOpen)));
      if (willOpen && panel) {
        const filter = COMPANY_FILTER_CONFIG.find((item) => item.key === key);
        if (filter?.tree) {
          [...filterCtx(scope).state[key]].forEach((value) => ensureTreeAncestors(key, value, scope));
          refreshFilterPanel(key, scope);
        }
        panel.classList.remove('is-flipped');
        // 以筛选条右边缘为界，超出时改为右对齐，避免面板被抽屉/卡片裁掉
        const bounds = (filterRoot(scope) || document.body).getBoundingClientRect();
        const rect = panel.getBoundingClientRect();
        if (rect.right > Math.min(window.innerWidth - 12, bounds.right + 8)) panel.classList.add('is-flipped');
        panel.querySelector('input[type="search"]')?.focus();
      }
      return;
    }
    if (event.target.closest('.filter-drop-panel')) return;
    closeCompanyFilterPanels();
  });
  document.addEventListener('click', (event) => {
    const treeToggle = event.target.closest('[data-tree-toggle]');
    if (treeToggle) {
      const scope = eventFilterScope(event);
      const key = treeToggle.dataset.treeToggle;
      const value = treeToggle.dataset.value;
      const expanded = getFilterTreeExpanded(key, scope);
      if (expanded.has(value)) expanded.delete(value);
      else expanded.add(value);
      refreshFilterPanel(key, scope);
      return;
    }
    const option = event.target.closest('[data-filter-option]');
    if (option) {
      toggleCompanyFilterOption(option.dataset.filterOption, option.dataset.value, eventFilterScope(event));
      return;
    }
    const reset = event.target.closest('[data-filter-reset]');
    if (reset) {
      const scope = eventFilterScope(event);
      clearCompanyFilter(reset.dataset.filterReset, scope);
      applyCompanyFilters(scope);
      refreshFilterPanel(reset.dataset.filterReset, scope);
      return;
    }
    const done = event.target.closest('[data-filter-done]');
    if (done) {
      closeCompanyFilterPanels('', eventFilterScope(event));
      return;
    }
    const remove = event.target.closest('[data-filter-remove]');
    if (remove) {
      const scope = eventFilterScope(event);
      const state = filterCtx(scope).state;
      if (state[remove.dataset.filterRemove] instanceof Set) state[remove.dataset.filterRemove].delete(remove.dataset.value);
      else state[remove.dataset.filterRemove] = 'all';
      applyCompanyFilters(scope);
      return;
    }
    const clearChips = event.target.closest('[data-clear-filter-chips]');
    if (clearChips) {
      const scope = clearChips.dataset.clearFilterChips || 'list';
      COMPANY_FILTER_CONFIG.forEach((filter) => clearCompanyFilter(filter.key, scope));
      applyCompanyFilters(scope);
      return;
    }
    const clearAll = event.target.closest('[data-clear-filters]');
    if (clearAll) {
      const scope = clearAll.dataset.clearFilters || 'list';
      COMPANY_FILTER_CONFIG.forEach((filter) => clearCompanyFilter(filter.key, scope));
      applyCompanyFilters(scope);
      if (scope === 'list') showToast('已清空企业筛选条件');
      return;
    }
  });
  document.addEventListener('input', (event) => {
    const input = event.target.closest('[data-filter-search]');
    if (!input) return;
    const scope = eventFilterScope(event);
    const key = input.dataset.filterSearch;
    const filter = COMPANY_FILTER_CONFIG.find((item) => item.key === key);
    if (filter?.tree) {
      const list = input.closest('.filter-drop-panel')?.querySelector('[data-filter-list]');
      if (list) list.innerHTML = renderFilterTree(filter, input.value, scope);
      return;
    }
    const keyword = input.value.trim().toLowerCase();
    const list = input.closest('.filter-drop-panel')?.querySelector('[data-filter-list]');
    if (!list) return;
    let visible = 0;
    list.querySelectorAll('[data-filter-option]').forEach((option) => {
      const matched = !keyword || option.textContent.toLowerCase().includes(keyword);
      option.hidden = !matched;
      if (matched) visible += 1;
    });
    const empty = list.querySelector('.filter-option-empty');
    if (empty) empty.hidden = visible > 0;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCompanyFilterPanels();
  });
  window.addEventListener('resize', () => closeCompanyFilterPanels());
}

function getFilteredCompanyRows(profile = getProfile()) {
  const baseRecords = getProfileCompanyRecords(profile);
  const records = getVisibleCompanyRecords(profile);
  const nodeMap = getCompanyNodeMap(baseRecords);
  const filtered = records.filter((company) => companyMatchesCompanyFilters(company));
  return { baseRecords, records, nodeMap, filtered };
}

function buildCompanyTableRows(profile = getProfile()) {
  const { baseRecords, records, nodeMap, filtered } = getFilteredCompanyRows(profile);
  const byName = new Map();
  filtered.forEach((company) => {
    const existing = byName.get(company.name);
    const nodes = [...(nodeMap.get(company.name) || new Set([company.node]))];
    if (existing) {
      existing.nodes = [...new Set([...existing.nodes, ...nodes])];
      return;
    }
    byName.set(company.name, { company, nodes });
  });
  return {
    baseRecords,
    records,
    rows: [...byName.values()],
    uniqueTotal: new Set(baseRecords.map((company) => company.name)).size,
    matchedTotal: byName.size
  };
}

function renderCompanyList(profile = getProfile()) {
  const list = $('#onchainCompanyList');
  if (!list) return;
  renderCompanyFilterBar('list');
  syncCompanyFilterTriggers('list');
  renderCompanyFilterChips('list');
  const { rows, uniqueTotal, matchedTotal } = buildCompanyTableRows(profile);
  const pageSize = 40;
  const visibleRows = rows.slice(0, pageSize);
  setText('#companyListTotal', matchedTotal.toLocaleString('zh-CN'));
  setText('#companyListScope', profile
    ? `展示“${profile.title}”当前筛选下的代表企业样本，点击企业所在环节可查看完整清单与证据。`
    : '当前筛选只有官方产业体系命名，暂未接入对应的企业清单。');
  const filteredActive = hasActiveCompanyFilters();
  $('#companyListSummary').textContent = rows.length > visibleRows.length
    ? `${filteredActive ? '筛选后' : ''}显示 ${visibleRows.length} / ${rows.length} 家匹配企业，可继续缩小条件或导出完整清单`
    : `${filteredActive ? '筛选后' : ''}显示 ${rows.length} / ${uniqueTotal} 家匹配企业`;
  if (!visibleRows.length) {
    list.innerHTML = '<div class="company-list-empty"><div class="empty-graph-icon">' + icon('building', 'ui-icon') + '</div><strong>当前条件暂无企业清单</strong><p>可放宽筛选条件或更换产业链后继续查看。</p></div>';
    return;
  }
  const head = `<thead><tr><th class="col-index">序号</th><th class="col-company">企业名称</th><th class="col-nodes">关联节点</th><th class="col-honor">企业荣誉</th><th class="col-phone">联系电话</th><th class="col-email">联系邮箱</th><th class="col-date">成立日期</th><th class="col-legal">法定代表人</th><th class="col-capital">注册资本</th><th class="col-region">省份</th><th class="col-region">城市</th><th class="col-region">区县</th></tr></thead>`;
  const body = visibleRows.map(({ company, nodes }, index) => {
    const honors = company.honors || [];
    // 单元格只展示一行：首个荣誉 + 剩余数量，全部内容见浮窗
    const honorChips = honors.slice(0, 1).map((honor) => `<span class="honor-chip" title="${escapeHtml(honor)}">${escapeHtml(honor)}</span>`);
    if (honors.length > 1) honorChips.push(renderPopoverTrigger(`+${honors.length - 1}`, '全部企业荣誉', honors));
    const statusTags = [
      `<span class="table-tag status">${escapeHtml(company.operatingStatus || '在营')}</span>`,
      company.listed === '是' ? '<span class="table-tag listed">已上市</span>' : '',
      company.stockCode ? `<span class="table-tag code">${escapeHtml(company.stockCode)}</span>` : ''
    ].join('');
    return `<tr><td class="cell-index">${String(index + 1).padStart(2, '0')}</td><td class="cell-company"><button class="company-name-link" type="button" data-company-key="${escapeHtml(company.displayName || company.name)}" title="查看企业详情">${escapeHtml(company.displayName || company.name)}</button><div class="company-name-tags">${statusTags}</div></td><td class="cell-center">${renderPopoverTrigger(`${nodes.length} 个`, '关联产业链节点', nodes)}</td><td><div class="table-honor">${honorChips.join('') || '<span class="cell-empty">—</span>'}</div></td><td>${renderContactCell(company.phones || [])}</td><td>${renderContactCell(company.emails || [])}</td><td class="cell-date">${escapeHtml(company.registeredDate || '—')}</td><td class="cell-legal">${escapeHtml(company.legalPerson || '—')}</td><td class="cell-capital">${escapeHtml(company.registeredCapital || '—')}</td><td class="cell-region" title="${escapeHtml(company.province || '')}">${escapeHtml(company.province || '—')}</td><td class="cell-region" title="${escapeHtml(company.city || '')}">${escapeHtml(company.city || '—')}</td><td class="cell-region" title="${escapeHtml(company.district || '')}">${escapeHtml(company.district || '—')}</td></tr>`;
  }).join('');
  list.innerHTML = `<div class="company-table-scroll"><table class="company-table">${head}<tbody>${body}</tbody></table></div>${rows.length > pageSize ? `<div class="company-table-more">已展示前 ${pageSize} 家，完整清单可通过右上角「导出表格」获取</div>` : ''}`;
}

function csvCell(value) {
  const text = String(value ?? '').replace(/\r?\n/g, ' ');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportCompanyTable() {
  const profile = getProfile();
  if (!profile) {
    showToast('当前产业链暂无可导出的企业清单');
    return;
  }
  const { rows } = buildCompanyTableRows(profile);
  if (!rows.length) {
    showToast('当前筛选条件下暂无可导出的企业');
    return;
  }
  const header = ['序号', '企业名称', '登记状态', '是否上市', '股票代码', '关联产业链节点', '企业荣誉', '联系电话', '联系邮箱', '成立日期', '法定代表人', '注册资本', '省份', '城市', '区县', '注册地址'];
  const lines = [header.map(csvCell).join(',')];
  rows.forEach(({ company, nodes }, index) => {
    lines.push([
      index + 1,
      company.displayName || company.name,
      company.operatingStatus || '在营',
      company.listed === '是' ? '已上市' : '未上市',
      company.stockCode || '',
      nodes.join('、'),
      (company.honors || []).join('、'),
      (company.phones || []).join('；'),
      (company.emails || []).join('；'),
      company.registeredDate || '',
      company.legalPerson || '',
      company.registeredCapital || '',
      company.province || '',
      company.city || '',
      company.district || '',
      company.registeredAddress || ''
    ].map(csvCell).join(','));
  });
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const blob = new Blob([`\ufeff${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `上链企业清单-${profile.title}-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast(`已导出 ${rows.length} 家企业清单`);
}

function renderAnalysisLegacy(profile = getProfile()) {
  const regions = getCurrentIndustryRegions();
  const nodes = getAllNodes(profile);
  const records = getProfileCompanyRecords(profile);
  const uniqueCompanyCount = new Set(records.map((company) => company.name)).size;
  const coreRecordCount = nodes.reduce((total, node) => total + (node.coreCount || 0), 0);
  const stageCount = profile?.stages?.length || 0;
  const nodeCount = nodes.length;
  const coreCompanies = records.filter((company) => company.type === '核心产品企业').length;
  const potentialCompanies = Math.max(0, records.length - coreCompanies);
  const corePercent = records.length ? Math.round(coreCompanies / records.length * 1000) / 10 : 0;
  $('#analysisCompanyCount').textContent = uniqueCompanyCount.toLocaleString('zh-CN');
  $('#analysisRowCount').innerHTML = profile ? `${profile.nodeCount.toLocaleString('zh-CN')} <i>条</i>` : '—';
  $('#analysisStageSummary').textContent = profile ? `覆盖 ${stageCount} 个一级环节` : '暂无图谱明细';
  $('#analysisCoreCount').textContent = profile ? coreRecordCount.toLocaleString('zh-CN') : '—';
  setText('#analysisScope', profile ? `基于“${profile.title}”当前筛选结果，查看区域覆盖、企业结构与环节分布。` : '当前筛选只有官方产业体系命名，暂无对应的产业链分析数据。');
  setText('#analysisScopeContext', `${profile?.title || currentIndustry || '当前产业'} · ${getFilterContext()}`);
  $('#analysisRegionCount').textContent = `${regions.length} 个省市`;
  $('#distributionSystemTotal').textContent = regions.length;
  $('#distributionStageTotal').textContent = stageCount || '—';
  $('#distributionNodeTotal').textContent = nodeCount || '—';
  $('#distributionSystemBar').style.width = `${Math.min(100, Math.max(8, regions.length / Math.max(1, regionCatalog.length) * 100))}%`;
  $('.distribution-highlight .teal-bar').style.width = `${Math.min(100, stageCount / 8 * 100)}%`;
  $('.distribution-highlight .amber-bar').style.width = `${Math.min(100, nodeCount / 60 * 100)}%`;
  $('#companyMixTotal').textContent = uniqueCompanyCount.toLocaleString('zh-CN');
  $('#companyMixChart').style.setProperty('--core-pct', `${corePercent}%`);
  $('#companyCorePct').textContent = `${corePercent}%`;
  $('#companyPotentialPct').textContent = `${Math.max(0, Math.round((100 - corePercent) * 10) / 10)}%`;
  const stages = (profile?.stages || []).map((stage) => ({ ...stage, value: stage.nodes.reduce((sum, node) => sum + node.rowCount, 0) })).sort((first, second) => second.value - first.value).slice(0, 5);
  const maxStageValue = Math.max(...stages.map((stage) => stage.value), 0);
  $('#analysisStageBars').innerHTML = stages.length ? stages.map((stage) => `<div><span>${escapeHtml(stage.title)}</span><i><b class="${stage.color}-fill" style="height: ${maxStageValue ? Math.max(8, Math.round(stage.value / maxStageValue * 100)) : 0}%"></b></i><strong>${stage.value.toLocaleString('zh-CN')}</strong></div>`).join('') : '<div class="stage-empty">暂无环节记录</div>';
  $('#analysisStageAxis').textContent = maxStageValue ? Math.round(maxStageValue / 2).toLocaleString('zh-CN') : '—';
  $('#analysisStageAxis').nextElementSibling.textContent = maxStageValue ? maxStageValue.toLocaleString('zh-CN') : '—';
  renderDistribution();
  renderCompanyList(profile);
}

function getUniqueCompanyRecords(records = []) {
  return [...new Map(records.map((company) => [company.name, company])).values()];
}

function formatAnalysisPercent(value, total) {
  return total ? `${Math.round(value / total * 1000) / 10}%` : '0%';
}

// 模拟企业产业链关联强度评分（0-100），等级划分：核心≥75、重要50-74、一般25-49、边缘<25
function companyChainScore(company) {
  const seed = [...String(company.name)].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 100003, 7);
  return seed % 101;
}

function renderMetricBars(id, entries, emptyText = '当前条件暂无数据') {
  const container = $(`#${id}`);
  if (!container) return;
  const max = Math.max(...entries.map(([, value]) => value), 0);
  container.innerHTML = entries.length
    ? entries.map(([label, value], index) => `<div class="metric-bar-row"><span>${escapeHtml(label)}</span><i><b class="metric-bar-fill-${index % 4}" style="width:${max && value ? Math.max(5, Math.round(value / max * 100)) : 0}%"></b></i><strong>${value.toLocaleString('zh-CN')} 家</strong></div>`).join('')
    : `<div class="metric-empty">${escapeHtml(emptyText)}</div>`;
}

// 注册资本分布：竖向柱状图
const capitalColumnLabels = {
  '100万以内': '≤100万',
  '100万-200万': '100-200万',
  '200万-500万': '200-500万',
  '500万-1000万': '500-1000万',
  '1000万-5000万': '1000-5000万',
  '5000万以上': '≥5000万'
};

function renderCapitalColumns(id, buckets) {
  const container = $(`#${id}`);
  if (!container) return;
  const max = Math.max(...buckets.map(([, value]) => value), 0);
  container.innerHTML = buckets.length
    ? `<div class="capital-column-grid">${buckets.map(([label, value], index) => `<div class="capital-column" title="${escapeHtml(label)} ${value} 家"><span>${value.toLocaleString('zh-CN')}</span><div class="capital-column-track"><i class="capital-fill-${index % 4}" style="height:${max && value ? Math.max(4, Math.round(value / max * 100)) : 0}%"></i></div><small>${escapeHtml(capitalColumnLabels[label] || label)}</small></div>`).join('')}</div>`
    : '<div class="metric-empty">当前条件暂无数据</div>';
}

// 融资轮次占比：环形图
const financingDonutColors = ['#2478dc', '#4d9ade', '#168c7c', '#5fb8aa', '#d99a3d'];

function renderFinancingDonut(id, buckets) {
  const container = $(`#${id}`);
  if (!container) return;
  const total = buckets.reduce((sum, [, value]) => sum + value, 0);
  if (!total) {
    container.innerHTML = '<div class="metric-empty">当前条件暂无融资事件</div>';
    return;
  }
  let acc = 0;
  const segments = buckets.map(([, value], index) => {
    const start = acc / total * 100;
    acc += value;
    const end = acc / total * 100;
    return `${financingDonutColors[index % financingDonutColors.length]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
  });
  const shareOf = (value) => `${Math.round(value / total * 1000) / 10}%`;
  container.innerHTML = `<div class="donut-chart financing-donut-ring" style="background:conic-gradient(${segments.join(',')})"><div><strong>${total.toLocaleString('zh-CN')}</strong><span>融资事件</span></div></div><div class="donut-legend">${buckets.map(([label, value], index) => `<div><i class="legend-square" style="background:${financingDonutColors[index % financingDonutColors.length]}"></i><span>${escapeHtml(label)}</span><b>${value.toLocaleString('zh-CN')} 起 · ${shareOf(value)}</b></div>`).join('')}</div>`;
}

// 年度融资事件：折线面积趋势图
function renderFinancingYearLine(id, entries, emptyText = '当前条件暂无数据') {
  const container = $(`#${id}`);
  if (!container) return;
  const max = Math.max(...entries.map(([, value]) => value), 0);
  if (!entries.length || !max) {
    container.innerHTML = `<div class="metric-empty">${escapeHtml(emptyText)}</div>`;
    return;
  }
  const width = 560;
  // 按容器实际宽高比确定视图高度，让折线图填满面板、避免底部留白
  const lineRect = container.getBoundingClientRect();
  const height = lineRect.width && lineRect.height
    ? Math.round(Math.min(320, Math.max(150, width * lineRect.height / lineRect.width)))
    : 178;
  const padX = 34;
  const padTop = 26;
  const padBottom = 30;
  const stepX = entries.length > 1 ? (width - padX * 2) / (entries.length - 1) : 0;
  const yOf = (value) => padTop + (1 - value / max) * (height - padTop - padBottom);
  const points = entries.map(([, value], index) => [padX + index * stepX, yOf(value)]);
  const linePath = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)} ${height - padBottom} L${points[0][0].toFixed(1)} ${height - padBottom} Z`;
  container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="年度融资事件数量趋势图"><defs><linearGradient id="finYearArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2478dc" stop-opacity=".26"/><stop offset="1" stop-color="#2478dc" stop-opacity="0"/></linearGradient></defs>${[.25, .5, .75].map((ratio) => {
    const y = padTop + ratio * (height - padTop - padBottom);
    return `<line class="finyear-grid" x1="${padX}" y1="${y.toFixed(1)}" x2="${width - padX}" y2="${y.toFixed(1)}"></line>`;
  }).join('')}<line class="finyear-axis" x1="${padX}" y1="${height - padBottom}" x2="${width - padX}" y2="${height - padBottom}"></line><path d="${areaPath}" fill="url(#finYearArea)"></path><path class="finyear-line" d="${linePath}"></path>${points.map(([x, y], index) => `<circle class="finyear-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6"></circle><text class="finyear-value" x="${x.toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle">${entries[index][1].toLocaleString('zh-CN')}</text>`).join('')}${entries.map(([label], index) => `<text class="finyear-year" x="${points[index][0].toFixed(1)}" y="${height - 9}" text-anchor="middle">${escapeHtml(label)}</text>`).join('')}</svg>`;
}

const analysisTrendYears = [2022, 2023, 2024, 2025, 2026];

function parseCapitalWan(value) {
  const text = String(value || '');
  const amount = Number.parseFloat(text.replace(/,/g, '')) || 0;
  if (text.includes('亿')) return amount * 10000;
  if (text.includes('万')) return amount;
  return amount * 10000;
}

function renderDualTrendChart(id, entries, emptyText = '当前条件暂无数据') {
  const container = $(`#${id}`);
  if (!container) return;
  const max = Math.max(...entries.map((entry) => Math.max(entry.total, entry.newCount)), 0);
  const heightOf = (value) => (max && value ? Math.max(4, Math.round(value / max * 100)) : 0);
  container.innerHTML = entries.length
    ? `<div class="dual-trend-grid">${entries.map((entry) => `<div class="dual-trend-column"><div class="dual-trend-bars"><div class="dual-bar"><span>${entry.newCount.toLocaleString('zh-CN')}</span><i class="series-new" title="新注册企业 ${entry.newCount} 家" style="height:${heightOf(entry.newCount)}%"></i></div><div class="dual-bar"><span>${entry.total.toLocaleString('zh-CN')}</span><i class="series-total" title="企业总量 ${entry.total} 家" style="height:${heightOf(entry.total)}%"></i></div></div><small>${escapeHtml(entry.label)}</small></div>`).join('')}</div>`
    : `<div class="metric-empty">${escapeHtml(emptyText)}</div>`;
}

let analysisRegionFilter = '';
let analysisRegionOwner = '';

function renderAnalysis(profile = getProfile()) {
  const records = getVisibleCompanyRecords(profile);
  const companies = getUniqueCompanyRecords(records);
  // 切换产业链后重置地区筛选
  const regionOwner = profile?.title || currentIndustry || '';
  if (analysisRegionOwner !== regionOwner) {
    analysisRegionOwner = regionOwner;
    analysisRegionFilter = '';
  }
  const scopedCompanies = analysisRegionFilter
    ? companies.filter((company) => company.province === analysisRegionFilter)
    : companies;
  const total = scopedCompanies.length;
  const coreCompanies = scopedCompanies.filter((company) => companyChainScore(company) >= 50).length;
  const provinceCounts = new Map();
  scopedCompanies.forEach((company) => provinceCounts.set(company.province, (provinceCounts.get(company.province) || 0) + 1));
  const topProvinces = [...provinceCounts].sort(([, first], [, second]) => second - first);
  const stageCounts = new Map((profile?.stages || []).map((stage) => [stage.title, 0]));
  scopedCompanies.forEach((company) => stageCounts.set(company.stage, (stageCounts.get(company.stage) || 0) + 1));
  const topStage = [...stageCounts].sort(([, first], [, second]) => second - first)[0];
  const topProvince = topProvinces[0];
  const secondProvince = topProvinces[1];
  const capitalBuckets = [['100万以内', 0], ['100万-200万', 0], ['200万-500万', 0], ['500万-1000万', 0], ['1000万-5000万', 0], ['5000万以上', 0]];
  scopedCompanies.forEach((company) => {
    const capital = parseCapitalWan(company.registeredCapital);
    const capitalIndex = capital <= 100 ? 0 : capital <= 200 ? 1 : capital <= 500 ? 2 : capital <= 1000 ? 3 : capital <= 5000 ? 4 : 5;
    capitalBuckets[capitalIndex][1] += 1;
  });

  const yearCounts = new Map(analysisTrendYears.map((year) => [year, 0]));
  scopedCompanies.forEach((company) => {
    const year = Number.parseInt(company.registeredDate, 10);
    if (yearCounts.has(year)) yearCounts.set(year, yearCounts.get(year) + 1);
  });
  let cumulativeTotal = 0;
  const trendEntries = analysisTrendYears.map((year) => {
    const newCount = yearCounts.get(year) || 0;
    cumulativeTotal += newCount;
    return { label: String(year), newCount, total: cumulativeTotal };
  });

  const financingCompanies = scopedCompanies.filter((company) => company.financingEvents > 0);
  const financingEvents = financingCompanies.reduce((sum, company) => sum + company.financingEvents, 0);
  const financingAmountWan = financingCompanies.reduce((sum, company) => sum + (company.financingAmountWan || 0), 0);
  const financingBuckets = ['天使轮', 'A轮', 'B轮', 'C轮及以上', '战略融资']
    .map((round) => [round, financingCompanies.filter((company) => company.financingRound === round).length]);

  // 年度融资事件：按企业名确定性散列把事件分摊到统计年份，主年份占比更高以形成自然波动
  const financingYearEntries = analysisTrendYears.map((year) => [String(year), 0]);
  financingCompanies.forEach((company) => {
    const seed = [...String(company.name)].reduce((sum, ch) => sum + ch.charCodeAt(0) * 7, 0);
    const primaryIndex = seed % financingYearEntries.length;
    const primaryShare = 0.5 + (seed % 50) / 100;
    const secondaryIndex = (primaryIndex + 1 + (seed >> 3) % (financingYearEntries.length - 1)) % financingYearEntries.length;
    const totalEvents = company.financingEvents;
    financingYearEntries[primaryIndex][1] += Math.max(1, Math.round(totalEvents * primaryShare));
    financingYearEntries[secondaryIndex][1] += Math.max(0, totalEvents - Math.max(1, Math.round(totalEvents * primaryShare)));
  });

  const qualificationEntries = [
    ['上市公司', scopedCompanies.filter((company) => company.listed === '是').length],
    ['专精特新企业', scopedCompanies.filter((company) => (company.honors || []).some((honor) => honor.includes('专精特新'))).length],
    ['高新技术企业', scopedCompanies.filter((company) => (company.honors || []).some((honor) => honor.includes('高新技术'))).length],
    ['科技型中小企业', scopedCompanies.filter((company) => (company.honors || []).some((honor) => honor.includes('科技型中小企业'))).length]
  ];

  setText('#analysisScope', profile
    ? `基于“${profile.title}”当前可见企业样本，观察区域分布、企业结构、发展阶段与关键环节。`
    : '当前筛选只有官方产业体系命名，暂无对应的产业链分析数据。');
  setText('#analysisScopeContext', `${profile?.title || currentIndustry || '当前产业'} · ${getFilterContext()}`);
  setText('#analysisStoryTitle', total
    ? `${topProvince?.[0] || '当前区域'}的企业样本相对集中，${topStage?.[0] || '产业环节'}关联度较高`
    : '选择产业链后生成产业特征');
  setText('#analysisStoryText', total
    ? `当前筛选得到 ${total.toLocaleString('zh-CN')} 家去重企业样本，${topProvince?.[0] || '主要地区'}有 ${topProvince?.[1] || 0} 家${secondProvince ? `，${secondProvince[0]}有 ${secondProvince[1]} 家` : ''}；${topStage?.[0] || '主要环节'}关联 ${topStage?.[1] || 0} 家。重要及核心企业占 ${formatAnalysisPercent(coreCompanies, total)}。`
    : '请先选择一条有图谱明细的产业链，或放宽当前企业筛选条件。');
  const coveredStages = [...stageCounts.values()].filter((count) => count > 0).length;
  const stageTotal = stageCounts.size;
  const topProvinceShare = total && topProvince ? Math.round(topProvince[1] / total * 100) : 0;
  const shortProvince = (name) => String(name).replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区/g, '');
  const regionSelect = $('#analysisRegionFilter');
  if (regionSelect) {
    const allProvinces = [...new Set(companies.map((company) => company.province))];
    regionSelect.innerHTML = ['<option value="">全国</option>']
      .concat(allProvinces.map((province) => `<option value="${escapeHtml(province)}">${escapeHtml(province)}</option>`))
      .join('');
    regionSelect.value = analysisRegionFilter;
    syncCustomSelect(regionSelect);
  }
  $('#distributionCompanyTotal').textContent = total.toLocaleString('zh-CN');
  $('#distributionCompanyNote').textContent = topProvince && total ? `Top1 ${shortProvince(topProvince[0])} ${topProvince[1].toLocaleString('zh-CN')} 家 · 占 ${topProvinceShare}%` : '当前条件暂无企业样本';
  $('#distributionCompanyBar').style.width = `${topProvinceShare}%`;
  $('#distributionStageTotal').textContent = coveredStages.toLocaleString('zh-CN');
  $('#distributionStageNote').textContent = stageTotal ? `已覆盖全部 ${stageTotal} 个产业环节的 ${Math.round(coveredStages / stageTotal * 100)}%` : '当前产业暂无环节数据';
  $('#distributionStageBar').style.width = `${stageTotal ? Math.round(coveredStages / stageTotal * 100) : 0}%`;
  $('#distributionCoreTotal').textContent = coreCompanies.toLocaleString('zh-CN');
  $('#distributionCoreNote').textContent = `关联强度 ≥50 分（核心+重要） · 占企业样本 ${formatAnalysisPercent(coreCompanies, total)}`;
  $('#distributionCoreBar').style.width = `${total ? Math.round(coreCompanies / total * 100) : 0}%`;
  renderDualTrendChart('listingTrendChart', trendEntries);
  $('#listingTrendNote').textContent = total
    ? `2022—2026 年度累计 ${total.toLocaleString('zh-CN')} 家 · ${analysisTrendYears[analysisTrendYears.length - 1]} 年新注册 ${(yearCounts.get(analysisTrendYears[analysisTrendYears.length - 1]) || 0).toLocaleString('zh-CN')} 家`
    : '当前筛选条件暂无企业样本';
  renderCapitalColumns('analysisCapitalColumns', capitalBuckets);
  const topCapital = [...capitalBuckets].sort((first, second) => second[1] - first[1])[0];
  $('#capitalNote').textContent = total && topCapital && topCapital[1]
    ? `注册资本主要集中在「${topCapital[0]}」区间，共 ${topCapital[1].toLocaleString('zh-CN')} 家，占样本 ${formatAnalysisPercent(topCapital[1], total)}`
    : '当前筛选条件暂无企业样本';
  $('#financingEventTotal').textContent = `${financingEvents.toLocaleString('zh-CN')} 起`;
  $('#financingKpis').innerHTML = [
    ['获投企业', financingCompanies.length, '家'],
    ['融资事件', financingEvents, '起'],
    ['披露金额', Math.round(financingAmountWan / 100) / 100, '亿元']
  ].map(([label, value, unit]) => `<div><strong>${Number(value).toLocaleString('zh-CN')}</strong><span>${escapeHtml(label)}<i>${escapeHtml(unit)}</i></span></div>`).join('');
  renderFinancingDonut('analysisFinancingDonut', financingBuckets);
  $('#financingYearTotal').textContent = `${financingEvents.toLocaleString('zh-CN')} 起`;
  renderFinancingYearLine('analysisFinancingYearLine', financingYearEntries);
  $('#qualificationRate').textContent = `${total.toLocaleString('zh-CN')} 家`;
  $('#analysisQualificationGrid').innerHTML = qualificationEntries.map(([label, value]) => `<div class="qualification-card"><div class="qualification-copy"><span>${escapeHtml(label)}</span><strong>${value.toLocaleString('zh-CN')}<i>家</i></strong></div><div class="qualification-track"><b style="width:${total && value ? Math.max(4, Math.round(value / total * 100)) : 0}%"></b></div><small>占样本 ${formatAnalysisPercent(value, total)}</small></div>`).join('');
  renderDistribution(companies);
  renderCompanyList(profile);
}

function renderGraph() {
  const entries = getAvailableIndustryEntries();
  if (chainSelectionActive) ensureCurrentIndustry(entries);
  const profile = getProfile();
  const query = getSearchText();
  const chainMap = $('#chainMap');
  renderChainPicker(profile);
  if (!chainSelectionActive) {
    $('#graphNodeCount').textContent = '—';
    $('#graphCompanyCount').textContent = '—';
    $('#mapLegend').innerHTML = '';
    chainMap.innerHTML = '';
    renderAnalysis(null);
    return;
  }
  setText('#graphTitle', currentIndustry || '未选择产业链');
  if (!profile) {
    $('#graphNodeCount').textContent = '—';
    $('#graphCompanyCount').textContent = '—';
    $('#mapLegend').innerHTML = '';
    chainMap.innerHTML = `<div class="empty-graph-state"><div class="empty-graph-icon">${icon('layers', 'ui-icon')}</div><strong>${escapeHtml(currentIndustry || '当前筛选')}</strong><p>当前筛选结果只有官方产业体系命名，暂无对应的产业链明细工作簿。</p><small>可继续调整筛选条件，或选择“集成电路 / 半导体与集成电路”查看已接入图谱。</small></div>`;
    renderAnalysis(null);
    return;
  }
  const visibleCompanyTotal = new Set(getVisibleCompanyRecords(profile).map((company) => company.name)).size;
  $('#graphNodeCount').textContent = profile.nodeCount.toLocaleString('zh-CN');
  $('#graphCompanyCount').textContent = visibleCompanyTotal.toLocaleString('zh-CN');
  $('#mapLegend').innerHTML = '<span class="legend-explainer"><i class="node-status-dot advantage"></i>优势环节</span><span class="legend-explainer"><i class="node-status-dot weak"></i>弱势环节</span><span class="legend-explainer"><i class="node-status-dot break"></i>断链环节</span>';
  const nodeStatusIndex = buildNodeStatusIndex(profile);
  const companyMatchNodes = new Set(nodeCompanies.filter((company) => company.name.toLowerCase().includes(query)).map((company) => company.node));
  chainMap.innerHTML = profile.stages.map((stage, index) => {
    const stageNodes = stage.nodes;
    const stageCountLabel = `${stage.count} 类`;
    const stageHasPaths = stageNodes.some((node) => Array.isArray(node.paths) && node.paths.length);
    const stageToggle = stageHasPaths
      ? `<button class="stage-toggle" type="button" data-stage-toggle aria-expanded="true" aria-label="折叠${escapeHtml(stage.title)}阶段全部细分环节" title="折叠本阶段全部细分环节">${icon('chevron-down', 'ui-icon mini')}</button>`
      : '';
    return `<div class="stage-column ${stage.color} ${index > 0 ? 'connected-stage' : ''}"><div class="stage-heading"><div><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(stage.title)}</strong></div><b class="stage-count">${stageCountLabel}${stageToggle}</b></div><div class="node-list">${stageNodes.length ?     stageNodes.map((node) => {
      const searchable = node.searchable.toLowerCase();
      const matches = query && (searchable.includes(query) || companyMatchNodes.has(node.name));
      const companyTotal = getNodeVisibleCompanyCount(node);
      const hasCompanies = companyTotal > 0;
      const statusMeta = NODE_STATUS_META[getNodeStatus(node.name, nodeStatusIndex).key];
      const hierarchy = renderNodeHierarchy(node, statusMeta.className);
      const expandToggle = hierarchy
        ? `<button class="node-path-expand" type="button" aria-expanded="true" aria-label="收起细分环节" title="收起细分环节">${icon('chevron-down', 'ui-icon mini')}</button>`
        : '';
      return `<article class="node-card ${node.featured ? 'featured' : ''} ${hasCompanies ? 'has-companies' : ''} ${matches ? 'search-match' : ''}"><div class="node-card-head"><button class="node-card-main" type="button" data-node="${escapeHtml(node.name)}"><span class="node-card-title"><i class="node-role-dot is-${statusMeta.className}" title="${statusMeta.label}：${statusMeta.note}" aria-label="${statusMeta.label}"></i><strong title="${statusMeta.label}：${statusMeta.note}">${escapeHtml(node.name)}</strong></span></button>${expandToggle}</div>${hierarchy}</article>`;
    }).join('') : '<div class="empty-node-list">暂无符合条件的环节</div>'}</div></div>`;
  }).join('');
  $$('.node-card-main', chainMap).forEach((button) => button.addEventListener('click', () => openDrawer(button.dataset.node)));
  $$('.node-path-item', chainMap).forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    openDrawer(button.dataset.node, button.dataset.path);
  }));
  $$('.node-path-toggle', chainMap).forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const branch = button.closest('.node-path-node');
    if (!branch) return;
    const collapsed = branch.classList.toggle('is-collapsed');
    const name = (button.dataset.pathToggle || '').split('>').pop().trim();
    button.setAttribute('aria-expanded', String(!collapsed));
    button.setAttribute('aria-label', `${collapsed ? '展开' : '收起'} ${name}`);
    button.setAttribute('title', `${collapsed ? '展开' : '收起'} ${name}`);
    syncStageToggle(branch.closest('.stage-column'));
  }));
  // 卡片头部右侧的图标：只切换本卡片的细分环节显隐，不打开企业清单
  $$('.node-path-expand', chainMap).forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const details = button.closest('.node-card')?.querySelector('details.node-path-details');
    if (!details) return;
    details.open = !details.open;
    syncPathExpandButton(button, details.open);
    syncStageToggle(details.closest('.stage-column'));
  }));
  $$('.node-path-details', chainMap).forEach((details) => details.addEventListener('toggle', () => {
    syncPathExpandButton(details.closest('.node-card')?.querySelector('.node-path-expand'), details.open);
    syncStageToggle(details.closest('.stage-column'));
  }));
  $$('.stage-toggle', chainMap).forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const column = button.closest('.stage-column');
    if (!column) return;
    setStageExpanded(column, button.getAttribute('aria-expanded') !== 'true');
  }));
  renderAnalysis(profile);
}

// 让卡片右上角的展开/收起图标与细分环节实际状态保持一致
function syncPathExpandButton(button, expanded) {
  if (!button) return;
  button.setAttribute('aria-expanded', String(!!expanded));
  button.setAttribute('aria-label', expanded ? '收起细分环节' : '展开细分环节');
  button.setAttribute('title', expanded ? '收起细分环节' : '展开细分环节');
}

// 阶段级联动：一键折叠/展开该阶段下所有卡片细分环节与二级分支
function setStageExpanded(column, expanded) {
  if (!column) return;
  column.querySelectorAll('details.node-path-details').forEach((details) => {
    if (details.open !== expanded) details.open = expanded;
  });
  column.querySelectorAll('.node-path-toggle').forEach((toggle) => {
    const branch = toggle.closest('.node-path-node');
    if (!branch) return;
    branch.classList.toggle('is-collapsed', !expanded);
    const name = (toggle.dataset.pathToggle || '').split('>').pop().trim();
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', `${expanded ? '收起' : '展开'} ${name}`);
    toggle.setAttribute('title', `${expanded ? '收起' : '展开'} ${name}`);
  });
  syncStageToggle(column);
}

// 让阶段按钮的图标/文案与列内实际展开状态保持一致
function syncStageToggle(column) {
  if (!column) return;
  const button = column.querySelector('.stage-toggle');
  if (!button) return;
  const anyOpen = !!column.querySelector('details.node-path-details[open]')
    || !!column.querySelector('.node-path-node.has-children:not(.is-collapsed)');
  const stageName = column.querySelector('.stage-heading strong')?.textContent || '';
  button.setAttribute('aria-expanded', String(anyOpen));
  button.setAttribute('aria-label', `${anyOpen ? '折叠' : '展开'}${stageName}阶段全部细分环节`);
  button.setAttribute('title', anyOpen ? '折叠本阶段全部细分环节' : '展开本阶段全部细分环节');
}

function applyGraphFilters() {
  renderGraph();
}

function buildNodeHierarchy(paths) {
  const roots = [];
  paths.filter(Boolean).forEach((path) => {
    const levels = path.split(/\s*>\s*/).map((level) => level.trim()).filter(Boolean);
    let siblings = roots;
    levels.forEach((name) => {
      let item = siblings.find((candidate) => candidate.name === name);
      if (!item) {
        item = { name, children: [] };
        siblings.push(item);
      }
      siblings = item.children;
    });
  });
  return roots;
}

// 细分环节以列表形式展示，只用圆点颜色表达所属环节的判断结果，不再使用色块背景。
// 有下级的环节在右侧单独提供展开/收起图标，点击名称本身仍是查看企业清单。
function renderNodePathItems(items, nodeName, statusKey, parentPath = []) {
  return items.map((item) => {
    const path = [...parentPath, item.name].join(' > ');
    const hasChildren = item.children.length > 0;
    return `<li class="node-path-node ${hasChildren ? 'has-children' : 'is-leaf'}"><div class="node-path-row"><button class="node-path-item" type="button" data-node="${escapeHtml(nodeName)}" data-path="${escapeHtml(path)}" aria-label="查看${escapeHtml(path)}的企业清单"><span class="node-path-name"><i class="node-path-dot is-${statusKey}"></i>${escapeHtml(item.name)}</span></button>${hasChildren ? `<button class="node-path-toggle" type="button" data-path-toggle="${escapeHtml(path)}" aria-expanded="true" aria-label="收起 ${escapeHtml(item.name)}" title="收起 ${escapeHtml(item.name)}">${icon('chevron-down', 'ui-icon mini')}</button>` : ''}</div>${hasChildren ? `<ul class="node-path-children">${renderNodePathItems(item.children, nodeName, statusKey, [...parentPath, item.name])}</ul>` : ''}</li>`;
  }).join('');
}

function renderNodeHierarchy(node, statusKey = 'advantage') {
  const paths = Array.isArray(node.paths) ? node.paths.filter(Boolean) : [];
  if (!paths.length) return '';
  const items = buildNodeHierarchy(paths);
  return `<details class="node-path-details" open><summary class="node-path-summary-sr">细分环节</summary><div class="node-path-body"><ul class="node-path-tree">${renderNodePathItems(items, node.name, statusKey)}</ul></div></details>`;
}

function getDrawerNodeRecords() {
  if (!currentNode) return [];
  return nodeCompanies.filter((company) => company.node === currentNode.name);
}

function openDrawer(nodeName, subpath = '') {
  const profileNode = getAllNodes().find((node) => node.name === nodeName);
  if (!profileNode) return;
  currentNode = profileNode;
  currentNodePath = subpath;
  const companyRecords = getDrawerNodeRecords();
  const representativeCount = profileNode.companyNames?.length ?? companyRecords.length;
  const backdrop = $('#drawerBackdrop');
  $('#drawerTitle').textContent = subpath ? subpath.split(' > ').slice(-1)[0] : profileNode.name;
  // 副标题展示从一级环节到当前环节的逐级路径，如：设计—微处理器—高级处理器—AI芯片
  const pathParts = [profileNode.stage, profileNode.name];
  if (subpath) pathParts.push(...subpath.split(' > '));
  $('#drawerSubtitle').textContent = pathParts.join('—');
  // 切换环节后重置侧边栏筛选，避免上一次的省市区/环节条件套到新环节上
  COMPANY_FILTER_SCOPES.drawer.state = createCompanyFilterState();
  COMPANY_FILTER_SCOPES.drawer.optionsSource = '';
  COMPANY_FILTER_SCOPES.drawer.treeExpanded = { region: new Set(), node: new Set() };
  COMPANY_FILTER_SCOPES.drawer.advancedOpen = true;
  renderCompanyFilterBar('drawer');
  renderCompanyFilterChips('drawer');
  backdrop.hidden = false;
  document.body.classList.add('drawer-open');
  $('#drawerCompanyList').scrollTop = 0;
  renderDrawerCompanies();
}

// 侧边栏企业清单：与「上链企业清单」表格同一套展现规范（序号/名称/状态/关联节点/荣誉/电话/邮箱/成立日期/法人/注册资本/省市区）
function renderDrawerCompanyRow(company, index, nodeNames) {
  const honors = company.honors || [];
  // 单元格只展示一行：首个荣誉 + 剩余数量，全部内容见浮窗
  const honorChips = honors.slice(0, 1).map((honor) => `<span class="honor-chip" title="${escapeHtml(honor)}">${escapeHtml(honor)}</span>`);
  if (honors.length > 1) honorChips.push(renderPopoverTrigger(`+${honors.length - 1}`, '全部企业荣誉', honors));
  const statusTags = [
    `<span class="table-tag status">${escapeHtml(company.operatingStatus || '在营')}</span>`,
    company.listed === '是' ? '<span class="table-tag listed">已上市</span>' : '',
    company.stockCode ? `<span class="table-tag code">${escapeHtml(company.stockCode)}</span>` : ''
  ].join('');
  return `<tr><td class="cell-index">${String(index + 1).padStart(2, '0')}</td><td class="cell-company"><button class="company-name-link" type="button" data-company-key="${escapeHtml(company.displayName || company.name)}" title="查看企业详情">${escapeHtml(company.displayName || company.name)}</button><div class="company-name-tags">${statusTags}</div></td><td class="cell-center">${renderPopoverTrigger(`${nodeNames.length} 个`, '关联产业链节点', nodeNames)}</td><td><div class="table-honor">${honorChips.join('') || '<span class="cell-empty">—</span>'}</div></td><td>${renderContactCell(company.phones || [])}</td><td>${renderContactCell(company.emails || [])}</td><td class="cell-date">${escapeHtml(company.registeredDate || '—')}</td><td class="cell-legal">${escapeHtml(company.legalPerson || '—')}</td><td class="cell-capital">${escapeHtml(company.registeredCapital || '—')}</td><td class="cell-region" title="${escapeHtml(company.province || '')}">${escapeHtml(company.province || '—')}</td><td class="cell-region" title="${escapeHtml(company.city || '')}">${escapeHtml(company.city || '—')}</td><td class="cell-region" title="${escapeHtml(company.district || '')}">${escapeHtml(company.district || '—')}</td></tr>`;
}

function renderDrawerCompanies() {
  if (!currentNode) return;
  const companyRecords = getDrawerNodeRecords();
  const list = companyRecords.filter((company) => companyMatchesCompanyFilters(company, 'drawer'));
  const total = currentNode.companyNames?.length ?? companyRecords.length;
  $('#drawerFilterResult').textContent = `显示 ${list.length} / ${total} 家`;
  if (!list.length) {
    $('#drawerCompanyList').innerHTML = '<div class="empty-state">没有符合当前筛选的企业<br/><small>可以清空筛选条件后再试。</small></div>';
    return;
  }
  // 企业可能同时挂在多个环节，与清单表格一致展示「N 个」关联节点
  const nodeMap = new Map();
  nodeCompanies.forEach((item) => {
    if (!nodeMap.has(item.name)) nodeMap.set(item.name, new Set());
    nodeMap.get(item.name).add(item.node);
  });
  const head = `<thead><tr><th class="col-index">序号</th><th class="col-company">企业名称</th><th class="col-nodes">关联节点</th><th class="col-honor">企业荣誉</th><th class="col-phone">联系电话</th><th class="col-email">联系邮箱</th><th class="col-date">成立日期</th><th class="col-legal">法定代表人</th><th class="col-capital">注册资本</th><th class="col-region">省份</th><th class="col-region">城市</th><th class="col-region">区县</th></tr></thead>`;
  const body = list.map((company, index) => renderDrawerCompanyRow(company, index, [...(nodeMap.get(company.name) || new Set())])).join('');
  $('#drawerCompanyList').innerHTML = `<div class="company-table-scroll"><table class="company-table">${head}<tbody>${body}</tbody></table></div>`;
}

function closeDrawer() {
  $('#drawerBackdrop').hidden = true;
  document.body.classList.remove('drawer-open');
  currentNode = null;
  currentNodePath = '';
}

function setView(view) {
  if (view === 'analysis') view = 'graph';
  const meta = viewMeta[view];
  if (!meta) return;
  $$('.primary-nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  $$('.view-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === view));
  $('.main-content')?.scrollTo(0, 0);
  if (view === 'graph') setWorkbenchSection('graphSection');
  if (view !== 'company-detail') window.CompanyDetail?.close();
}

/* ===================== 首页 ===================== */
function renderHomeChainChips() {
  $$('.home-chain-chips').forEach((container) => {
    const system = container.dataset.system;
    container.innerHTML = nationalIndustryEntries
      .filter((entry) => entry.type === system)
      .map((entry) => `<button class="home-chain-chip" type="button" data-industry="${escapeHtml(entry.name)}">${escapeHtml(entry.name)}</button>`)
      .join('');
  });
  $$('.home-chain-chip').forEach((chip) => chip.addEventListener('click', () => {
    currentIndustry = chip.dataset.industry;
    chainSelectionActive = true;
    setChainSelectionMode(true);
    setView('graph');
    renderGraph();
  }));
  $$('[data-goto]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.goto)));
}

/* ===================== 企业详情跳转 ===================== */
const companyRecordIndex = new Map();
nodeCompanies.forEach((company) => {
  const key = company.displayName || company.name;
  if (key && !companyRecordIndex.has(key)) companyRecordIndex.set(key, company);
});

const companyDetailOrigin = { view: 'graph', node: '', path: '' };

function openCompanyDetailRecord(record) {
  if (!record) { showToast('未找到该企业的演示样本'); return; }
  if (!window.CompanyDetail) { showToast('企业详情模块未加载，请刷新后重试'); return; }
  const activePanel = $('.view-panel.active');
  const activeView = activePanel?.dataset.panel || 'graph';
  companyDetailOrigin.view = activeView === 'company-detail' ? 'graph' : activeView;
  companyDetailOrigin.node = currentNode?.name || '';
  companyDetailOrigin.path = currentNodePath || '';
  closeDrawer();
  setView('company-detail');
  window.CompanyDetail.open(record);
  $$('.primary-nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === 'graph'));
}

function openCompanyDetailByKey(key) {
  if (!key) return;
  const record = companyRecordIndex.get(key) || nodeCompanies.find((company) => company.name === key);
  openCompanyDetailRecord(record);
}

function closeCompanyDetail() {
  const originNode = companyDetailOrigin.node;
  const originPath = companyDetailOrigin.path;
  const originView = companyDetailOrigin.view === 'company-detail' ? 'graph' : companyDetailOrigin.view;
  setView(originView);
  if (originView === 'graph') {
    setWorkbenchSection('companySection');
    if (originNode) openDrawer(originNode, originPath);
  }
}

// 产业分析地图/下拉选择地区：再点一次同地区取消筛选
function selectAnalysisRegion(province) {
  analysisRegionFilter = analysisRegionFilter === province ? '' : province;
  renderAnalysis(getProfile());
  showToast(analysisRegionFilter
    ? `已按「${analysisRegionFilter.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区/g, '')}」筛选产业分析数据`
    : '已恢复查看全国上链企业分布');
}

function renderDistribution(companies = getVisibleCompanyRecords()) {
  const counts = new Map();
  companies.forEach((company) => counts.set(company.province, (counts.get(company.province) || 0) + 1));
  const currentDistribution = [...counts].sort(([, first], [, second]) => second - first);
  const max = Math.max(...currentDistribution.map(([, count]) => count), 1);
  if (!chinaMapProjection) renderChinaMapBase();
  // 排名跟随区域筛选：全国看各省排名，选中省份后看该省各市排名
  const rankGroups = new Map();
  const rankingTitle = $('#rankingTitle');
  if (analysisRegionFilter) {
    companies.forEach((company) => {
      if (company.province !== analysisRegionFilter) return;
      const city = company.city || analysisRegionFilter;
      rankGroups.set(city, (rankGroups.get(city) || 0) + 1);
    });
    if (rankingTitle) rankingTitle.textContent = '城市排名';
  } else {
    currentDistribution.forEach(([province, count]) => rankGroups.set(province, count));
    if (rankingTitle) rankingTitle.textContent = '省份排名';
  }
  const rankEntries = [...rankGroups].sort(([, first], [, second]) => second - first);
  const rankMax = Math.max(...rankEntries.map(([, count]) => count), 1);
  const rankStrip = (name) => analysisRegionFilter
    ? String(name).replace(/市|地区|自治州|盟/g, '')
    : String(name).replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区/g, '');
  $('#provinceTop10').innerHTML = rankEntries.length
    ? rankEntries.map(([name, count], index) => `<div class="metric-bar-row"><span><em>${String(index + 1).padStart(2, '0')}</em>${escapeHtml(rankStrip(name))}</span><i><b class="metric-bar-fill-${index % 4}" style="width:${Math.max(6, Math.round(count / rankMax * 100))}%"></b></i><strong>${count.toLocaleString('zh-CN')} 家</strong></div>`).join('')
    : '<div class="metric-empty">当前条件暂无企业样本</div>';
  // 散点按 SVG 实际绘制区域换算百分比，保证与省份图形对齐；容器暂无尺寸时退回 viewBox 百分比
  const mapVisual = $('.china-map-visual');
  const mapRect = mapVisual?.getBoundingClientRect();
  const MAP_VIEW = { width: 880, height: 640 };
  const mapScale = mapRect && mapRect.width && mapRect.height ? Math.min(mapRect.width / MAP_VIEW.width, mapRect.height / MAP_VIEW.height) : 0;
  const drawWidth = MAP_VIEW.width * mapScale;
  const drawHeight = MAP_VIEW.height * mapScale;
  const drawOffsetX = mapRect ? (mapRect.width - drawWidth) / 2 : 0;
  const drawOffsetY = mapRect ? (mapRect.height - drawHeight) / 2 : 0;
  $('#provinceMapPoints').innerHTML = currentDistribution.map(([province, count]) => {
    const coordinate = chinaProvinceCenters.get(province);
    const projected = coordinate && chinaMapProjection ? chinaMapProjection(coordinate) : null;
    const position = mapLocations[province];
    if (!projected && !position) return '';
    const ratio = count / max;
    const level = ratio >= .7 ? 4 : ratio >= .45 ? 3 : ratio >= .22 ? 2 : 1;
    const label = province.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区/g, '');
    const diameter = 12 + Math.round(ratio * 13);
    const left = projected && mapScale ? (drawOffsetX + projected.x * mapScale) / mapRect.width * 100
      : projected ? projected.x / MAP_VIEW.width * 100
      : position[0] / 6;
    const top = projected && mapScale ? (drawOffsetY + projected.y * mapScale) / mapRect.height * 100
      : projected ? projected.y / MAP_VIEW.height * 100
      : position[1] / 4;
    return `<button class="province-map-point level-${level}" type="button" style="left:${left}%;top:${top}%" data-province="${escapeHtml(province)}" title="${escapeHtml(province)} ${count} 家上链企业" aria-label="${escapeHtml(province)} ${count} 家上链企业"><i style="width:${diameter}px;height:${diameter}px"></i><span>${escapeHtml(label)} <b>${count}</b></span></button>`;
  }).join('');
  $$('.province-map-point').forEach((point) => {
    point.classList.toggle('is-active', point.dataset.province === analysisRegionFilter);
    point.addEventListener('click', () => selectAnalysisRegion(point.dataset.province));
  });
}

// 窗口尺寸变化后重新按绘制区域对齐散点
let distributionResizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(distributionResizeTimer);
  distributionResizeTimer = setTimeout(() => {
    if ($('#provinceMapPoints')?.childElementCount) renderDistribution();
  }, 200);
});

function getActiveConversation() {
  return aiConversations.find((conversation) => conversation.id === activeConversationId) || aiConversations[0];
}

function getAiContextSnapshot() {
  const industry = currentIndustry || $('#industryName')?.value || '半导体与集成电路';
  const province = $('#provinceSelect')?.value || '不限';
  const region = regionCatalog.find((item) => item.province === province);
  const regionLabel = province === '不限' ? '全国 31 省市' : `${province}${region?.system ? ` · ${region.system}` : ''}`;
  const regionScopeLabel = getRegionScopeLabel();
  const activeFilters = [
    regionScopeLabel !== '不限' ? `区域：${regionScopeLabel}` : ''
  ].filter(Boolean);
  return `${industry} / ${regionLabel} / ${activeFilters.length ? activeFilters.join(' · ') : '全部企业'}`;
}

function renderChatMessage(role, text) {
  const isUser = role === 'user';
  const message = document.createElement('div');
  message.className = `chat-message ${role}`;
  message.innerHTML = isUser
    ? `<div class="message-body"><span class="message-meta">你 · 刚刚</span><p>${escapeHtml(text)}</p></div>`
    : `<div class="message-avatar">${icon('spark', 'ui-icon mini')}</div><div class="message-body"><span class="message-meta">产业研究助手 · 刚刚</span><p>${text}</p><div class="message-actions"><button type="button" data-copy-message="${escapeHtml(text.replace(/<[^>]+>/g, ''))}">复制</button><button type="button" class="feedback-button">有帮助</button></div></div>`;
  return message;
}

function renderConversationList() {
  const list = $('#conversationList');
  if (!list) return;
  list.innerHTML = aiConversations.map((conversation) => {
    const latest = conversation.messages[conversation.messages.length - 1];
    const preview = String(latest?.text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const messageCount = conversation.messages.filter((message) => message.role === 'user').length;
    const isActive = conversation.id === activeConversationId;
    return `<button class="conversation-item ${isActive ? 'active' : ''}" type="button" data-conversation-id="${escapeHtml(conversation.id)}" aria-current="${isActive ? 'true' : 'false'}"><span class="conversation-item-icon">${icon('layers', 'ui-icon mini')}</span><span class="conversation-item-copy"><strong>${escapeHtml(conversation.title)}</strong><small>${escapeHtml(conversation.context)}</small><em>${messageCount ? `${messageCount} 条提问` : '尚未提问'} · ${escapeHtml(conversation.updated)}</em><span class="conversation-item-preview">${escapeHtml(preview)}</span></span></button>`;
  }).join('');
  $$('.conversation-item', list).forEach((button) => button.addEventListener('click', () => switchConversation(button.dataset.conversationId)));
}

function renderActiveConversation() {
  const conversation = getActiveConversation();
  const messages = $('#chatMessages');
  if (!conversation || !messages) return;
  messages.replaceChildren(...conversation.messages.map(({ role, text }) => renderChatMessage(role, text)));
  messages.scrollTop = messages.scrollHeight;
  const contextLabel = $('#chatContextLabel');
  if (contextLabel) contextLabel.textContent = `当前上下文：${conversation.context}`;
  $$('[data-copy-message]', messages).forEach((button) => button.addEventListener('click', () => showToast('回答内容已复制')));
}

function switchConversation(id) {
  if (!aiConversations.some((conversation) => conversation.id === id)) return;
  activeConversationId = id;
  renderConversationList();
  renderActiveConversation();
  $('#chatInput')?.focus();
}

function createConversation() {
  const id = `conversation-${Date.now()}`;
  aiConversations.unshift({
    id,
    title: '新对话',
    industry: currentIndustry || '半导体与集成电路',
    context: getAiContextSnapshot(),
    updated: '刚刚',
    messages: [{ role: 'assistant', text: '你好，这是一个新的产业研究对话。你可以从区域分布、核心环节或代表企业开始提问。' }]
  });
  activeConversationId = id;
  renderConversationList();
  renderActiveConversation();
  $('#chatInput')?.focus();
}

function getConversationTitle(question) {
  const title = question.replace(/[？?。！!，,：:；;\s]+/g, ' ').trim();
  return title.length > 18 ? `${title.slice(0, 18)}…` : title || '新对话';
}

function appendChatMessage(role, text) {
  const conversation = getActiveConversation();
  if (!conversation) return;
  conversation.messages.push({ role, text });
  conversation.updated = '刚刚';
  if (role === 'user' && conversation.title === '新对话') conversation.title = getConversationTitle(text);
  renderConversationList();
  renderActiveConversation();
}

function generateAnswer(question, conversation = getActiveConversation()) {
  const normalized = question.toLowerCase();
  const profile = conversation?.industry
    ? industryProfiles[conversation.industry] || Object.entries(industryProfiles).find(([name]) => industryNameMatches(name, conversation.industry))?.[1]
    : getProfile();
  if (!profile) return '<strong>当前产业：</strong>该产业目前只有官方体系命名，尚未接入产业链明细和代表企业数据。可以先返回产业图谱调整筛选范围。';
  const firstNodes = profile.stages.flatMap((stage) => stage.nodes).slice(0, 2).map((node) => node.name).join('”和“');
  if (normalized.includes('省') || normalized.includes('分布') || normalized.includes('集中')) return '<strong>地区判断：</strong>半导体与集成电路附件提供了省市官方产业体系，但代表企业记录没有注册省份字段，因此页面不会将企业样本虚构到具体省份。你可以通过省份和官方体系筛选相关产业链口径，再结合企业主体信息进行核验。';
  if (normalized.includes('补链') || normalized.includes('空白') || normalized.includes('机会')) return `<strong>建议优先关注：</strong>${profile.stages.filter((stage) => stage.nodes.some((node) => node.coreCount > 0)).slice(0, 3).map((stage) => stage.title).join('、')}等环节均有附件记录。没有核心标记的细分项应作为待核验线索，适合补充产品、技术和交付证据。`;
  if (normalized.includes('证据') || normalized.includes('复核')) return '<strong>证据判断：</strong>当前页面展示的是附件中的产业链层级和代表企业样本。正式上链仍需核验企业主体、产品能力、产业角色及相应的公开证据，附件中的代表企业不能直接等同于已完成上链。';
  if (normalized.includes('企业') || normalized.includes('名单')) return `<strong>可以这样查：</strong>在产业图谱中点击“${firstNodes}”等环节，右侧会打开代表企业清单。清单支持企业名称、未标注省份、企业类型和证据强度筛选。`;
  return `我已结合当前“${conversation?.context || `${profile.title} · 全国`}”进行判断。你可以继续问我区域产业体系、链上企业、层级节点或证据核验问题。`;
}

function sendChat() {
  const input = $('#chatInput');
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  const conversation = getActiveConversation();
  if (!conversation) return;
  if (conversation.title === '新对话') conversation.title = getConversationTitle(question);
  conversation.messages.push({ role: 'user', text: question });
  conversation.messages.push({ role: 'assistant', text: generateAnswer(question, conversation) });
  conversation.updated = '刚刚';
  renderConversationList();
  renderActiveConversation();
}

function clearActiveConversation() {
  const conversation = getActiveConversation();
  if (!conversation) return;
  conversation.messages = [{ role: 'assistant', text: '对话已清空。你可以继续询问半导体与集成电路的企业、节点、区域产业体系和证据情况。' }];
  conversation.updated = '刚刚';
  renderConversationList();
  renderActiveConversation();
}


function setWorkbenchSection(sectionId) {
  if (!chainSelectionActive) return;
  const target = document.getElementById(sectionId);
  if (!target) return;
  $$('.workbench-tab').forEach((tab) => {
    const isActive = tab.dataset.section === sectionId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  $$('.workbench-section').forEach((section) => section.classList.toggle('active', section.id === sectionId));
  // 分析分栏从隐藏变为可见时，容器尺寸才有意义，需重新渲染地图散点与图表尺寸
  if (sectionId === 'analysisSection') {
    renderDistribution();
    renderAnalysis(getProfile());
  }
}

// 图谱按“看图软件”方式平移：按住鼠标左键拖动即可左右/上下浏览，拖动后不触发节点点击。
function enableGraphPan() {
  const map = $('#chainMap');
  if (!map) return;
  const THRESHOLD = 4;
  let panning = false;
  let moved = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  const finish = () => {
    if (!panning) return;
    panning = false;
    map.classList.remove('is-panning');
    if (pointerId !== null && map.hasPointerCapture?.(pointerId)) map.releasePointerCapture(pointerId);
    pointerId = null;
    window.setTimeout(() => { moved = false; }, 60);
  };

  map.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.pointerType === 'touch') return;
    if (event.target.closest('input, select, textarea, a')) return;
    panning = true;
    moved = false;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = map.scrollLeft;
    startTop = map.scrollTop;
  });

  map.addEventListener('pointermove', (event) => {
    if (!panning || event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!moved && Math.abs(dx) + Math.abs(dy) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      map.classList.add('is-panning');
      // 只在真正开始拖动后才捕获指针，否则会把普通点击的目标改到画布上
      if (map.setPointerCapture) map.setPointerCapture(event.pointerId);
    }
    map.scrollLeft = startLeft - dx;
    map.scrollTop = startTop - dy;
  });

  ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach((type) => {
    map.addEventListener(type, finish);
    window.addEventListener(type, finish);
  });

  // 拖动结束后拦截这次点击，避免误打开企业清单抽屉
  map.addEventListener('click', (event) => {
    if (!moved) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  map.addEventListener('dragstart', (event) => event.preventDefault());
}

function setGraphFullscreen(isFullscreen) {
  const graphBoard = $('.graph-board');
  const filters = $('#advancedFilters');
  const normalSlot = $('#companyFilterSlot');
  const fullscreenSlot = $('#fullscreenFilterSlot');
  if (!graphBoard) return;
  graphBoard.classList.toggle('fullscreen-map', isFullscreen);
  document.body.classList.toggle('fullscreen-open', isFullscreen);
  if (filters && normalSlot && fullscreenSlot) (isFullscreen ? fullscreenSlot : normalSlot).append(filters);
}

function initCellPopovers() {
  const popover = document.createElement('div');
  popover.className = 'cell-popover';
  popover.hidden = true;
  document.body.appendChild(popover);
  // 离开触发点后留 0.3s 缓冲，方便鼠标移入浮窗继续查看/复制内容
  const HIDE_DELAY = 300;
  let hideTimer = 0;
  let activeTrigger = null;
  const hide = () => {
    popover.hidden = true;
    activeTrigger = null;
  };
  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hide, HIDE_DELAY);
  };
  const show = (trigger) => {
    const items = String(trigger.dataset.popoverItems || '').split('|').filter(Boolean);
    if (!items.length) return;
    popover.innerHTML = `<strong>${escapeHtml(trigger.dataset.popoverTitle || '')}</strong><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    popover.hidden = false;
    activeTrigger = trigger;
    const rect = trigger.getBoundingClientRect();
    const box = popover.getBoundingClientRect();
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - box.width - 8);
    let top = rect.bottom + 6;
    if (top + box.height > window.innerHeight - 8) top = rect.top - box.height - 6;
    popover.style.left = `${left}px`;
    popover.style.top = `${Math.max(8, top)}px`;
  };
  const isInside = (node) => Boolean(node && node.closest && node.closest('[data-popover-items], .cell-popover'));
  document.addEventListener('mouseover', (event) => {
    // 进入浮窗本身：取消隐藏，窗口保持打开
    if (event.target.closest && event.target.closest('.cell-popover')) {
      clearTimeout(hideTimer);
      return;
    }
    const trigger = event.target.closest('[data-popover-items]');
    if (!trigger) return;
    clearTimeout(hideTimer);
    if (trigger !== activeTrigger) show(trigger);
  });
  document.addEventListener('mouseout', (event) => {
    if (!isInside(event.target)) return;
    // 在两个触发点/浮窗之间移动时不隐藏，交给目标上的 mouseover 接管
    if (isInside(event.relatedTarget)) return;
    scheduleHide();
  });
  document.addEventListener('focusin', (event) => {
    const trigger = event.target.closest('[data-popover-items]');
    if (trigger) {
      clearTimeout(hideTimer);
      if (trigger !== activeTrigger) show(trigger);
    }
  });
  document.addEventListener('focusout', (event) => {
    if (event.target.closest('[data-popover-items]')) scheduleHide();
  });
  // 滚动、缩放会让浮窗错位，直接收起
  window.addEventListener('scroll', () => {
    clearTimeout(hideTimer);
    hide();
  }, true);
  window.addEventListener('resize', () => {
    clearTimeout(hideTimer);
    hide();
  });
}

function init() {
  setSelectOptions($('#provinceSelect'), [['不限', '不限', '全部省市'], ...regionCatalog.map((item) => [item.province, item.province, item.system])]);
  setSelectOptions($('#industryName'), [['不限', '不限']]);
  populateIndustryNameOptions(false);
  initializeRegionScopePicker();
  renderGraph();
  $$('.primary-nav-item').forEach((item) => item.addEventListener('click', () => setView(item.dataset.view)));
  $$('.workbench-tab').forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab.classList.contains('active')));
    tab.addEventListener('click', () => setWorkbenchSection(tab.dataset.section));
  });
  $('#graphSearchButton').addEventListener('click', runGraphSearch);
  $('#graphSearch').addEventListener('keydown', (event) => { if (event.key === 'Enter') runGraphSearch(); });
  $('#graphSearch').addEventListener('input', syncGraphSearchClear);
  $('#clearGraphSearch').addEventListener('click', () => {
    $('#graphSearch').value = '';
    syncGraphSearchClear();
    renderGraph();
    $('#graphSearch').focus();
  });
  syncGraphSearchClear();
  renderHomeChainChips();
  ['#regionScope'].forEach((selector) => $(selector)?.addEventListener('change', () => { syncAdvancedOptionGroup($(selector)); applyGraphFilters(); }));
  $('#changeChainButton').addEventListener('click', () => { showChainPicker(); showToast('请选择要查看的产业链'); });
  $('#fullscreenButton').addEventListener('click', () => setGraphFullscreen(!$('.graph-board').classList.contains('fullscreen-map')));
  $('#analysisRegionFilter')?.addEventListener('change', (event) => {
    analysisRegionFilter = event.target.value;
    renderAnalysis(getProfile());
  });
  $('#closeDrawer').addEventListener('click', closeDrawer);
  $('#drawerBackdrop').addEventListener('click', (event) => { if (event.target === $('#drawerBackdrop')) closeDrawer(); });
  $('#drawerExportButton').addEventListener('click', () => showToast('企业清单导出任务已创建'));
  ['#drawerCompanyList', '#onchainCompanyList'].forEach((selector) => {
    $(selector)?.addEventListener('click', (event) => {
      const nameLink = event.target.closest('[data-company-key]');
      if (!nameLink) return;
      event.preventDefault();
      openCompanyDetailByKey(nameLink.dataset.companyKey);
    });
  });
  $('#companyDetailBack')?.addEventListener('click', closeCompanyDetail);
  $('#sendChatButton').addEventListener('click', sendChat);
  $('#chatInput').addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendChat(); } });
  $$('.topic-button').forEach((button) => button.addEventListener('click', () => { $('#chatInput').value = button.dataset.prompt; sendChat(); }));
  $('#clearChatButton').addEventListener('click', clearActiveConversation);
  $('#newConversationButton').addEventListener('click', createConversation);
  $('#onchainContactButton').addEventListener('click', () => showToast('定制需求已记录，产业研究顾问将在 1 个工作日内联系您'));
  const homeQueryInput = $('#homeQueryInput');
  const submitHomeQuery = () => {
    const text = homeQueryInput.value.trim();
    if (!text) { showToast('请输入行业标签或问题'); homeQueryInput.focus(); return; }
    setView('ai');
    $('#chatInput').value = text;
    homeQueryInput.value = '';
    sendChat();
  };
  $('#homeQuerySend').addEventListener('click', submitHomeQuery);
  homeQueryInput.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submitHomeQuery(); } });
  $('#solutionContactButton').addEventListener('click', () => showToast('定制需求已记录，产业研究顾问将在 1 个工作日内联系您'));
  $('#solutionCtaButton').addEventListener('click', () => showToast('定制需求已记录，产业研究顾问将在 1 个工作日内联系您'));
  $('#solutionCatalogButton').addEventListener('click', () => setView('graph'));
  enhanceCustomSelects();
  enableGraphPan();
  initCellPopovers();
  initCompanyFilters();
  $('#exportCompanyTable')?.addEventListener('click', exportCompanyTable);
  ['#regionScope'].forEach((selector) => syncAdvancedOptionGroup($(selector)));
  renderConversationList();
  renderActiveConversation();
}

init();
