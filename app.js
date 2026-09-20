const industryTypeOrder = ['战略性新兴产业', '传统产业', '未来产业'];

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
  '第六代移动通信': ['第六代移动通信', '6G']
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
  const companyTotal = new Set(semiconductorNodes.flatMap((node) => node.companies)).size;
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
          companyNames: sourceNode.companies,
          nodeSearchable: [sourceNode.l1, sourceNode.l2, ...sourceNode.paths, ...sourceNode.terms].join(' '),
          searchable: [sourceNode.l1, sourceNode.l2, ...sourceNode.paths, ...sourceNode.terms, ...sourceNode.companies].join(' ')
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
  ['高新技术企业', '专精特新企业'],
  ['制造业单项冠军企业'],
  ['百强企业'],
  ['高新技术企业'],
  ['专精特新企业', '小巨人企业']
];

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

function buildSemiconductorCompanyRecords(nodes) {
  let recordIndex = 0;
  return nodes.flatMap((node) => node.companies.map((name) => {
    const index = recordIndex++;
    const regionIndex = simulatedEnterpriseRegionPattern[index % simulatedEnterpriseRegionPattern.length];
    const [province, address] = simulatedEnterpriseRegions[regionIndex];
    const { city, district } = resolveSimulatedAdministrativeArea(province, address);
    const honors = simulatedEnterpriseHonors[index % simulatedEnterpriseHonors.length];
    const intellectualProperty = simulatedEnterpriseIntellectualPropertyPattern[index % simulatedEnterpriseIntellectualPropertyPattern.length];
    const listed = index % 5 === 0 ? '是' : '否';
    const capital = `${(1.2 + (index % 9) * 0.7).toFixed(1)} 亿元`;
    const year = 2022 + (index % 5);
    const month = String((index % 12) + 1).padStart(2, '0');
    const day = String((index % 26) + 1).padStart(2, '0');
    return {
      name,
      displayName: `芯链示范企业${String(index + 1).padStart(2, '0')}`,
      province,
      city,
      district,
      registeredAddress: address,
      registeredCapital: capital,
      registeredDate: `${year}-${month}-${day}`,
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

function createChinaMapProjection(geoJson) {
  const coordinates = geoJson.features.flatMap((feature) => collectGeoCoordinates(feature.geometry?.coordinates));
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
  const width = 1000;
  const height = 620;
  const padding = 30;
  const scale = Math.min(
    (width - padding * 2) / (bounds.maxLongitude - bounds.minLongitude),
    (height - padding * 2) / (bounds.maxLatitude - bounds.minLatitude)
  );
  const contentWidth = (bounds.maxLongitude - bounds.minLongitude) * scale;
  const contentHeight = (bounds.maxLatitude - bounds.minLatitude) * scale;
  const offsetX = (width - contentWidth) / 2;
  const offsetY = (height - contentHeight) / 2;
  return ([longitude, latitude]) => ({
    x: offsetX + (longitude - bounds.minLongitude) * scale,
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

function renderChinaMapBase() {
  const target = $('#chinaMapPaths');
  const geoJson = window.chinaProvinceGeoJSON;
  if (!target || !geoJson?.features?.length) return;
  chinaMapProjection = createChinaMapProjection(geoJson);
  chinaProvinceCenters = new Map(geoJson.features.map((feature) => [feature.properties?.name, feature.properties?.center || feature.properties?.centroid]).filter(([, center]) => Array.isArray(center)));
  target.innerHTML = geoJson.features.map((feature) => {
    const province = feature.properties?.name || '';
    const path = geoGeometryToPath(feature.geometry, chinaMapProjection);
    return path ? `<path class="china-province-shape" data-province="${escapeHtml(province)}" d="${path}"><title>${escapeHtml(province)}</title></path>` : '';
  }).join('');
  $$('.china-province-shape').forEach((path) => path.addEventListener('click', () => selectProvinceOnMap(path.dataset.province)));
}

const viewMeta = {
  graph: ['INDUSTRY GRAPH', '产业图谱', '从产业节点到代表企业，查看半导体与集成电路的多级产业链关系。'],
  ai: ['AI RESEARCH AGENT', 'AI智能', '用自然语言查询企业、节点、证据和区域机会，回答会基于当前产业上下文生成。'],
  onchain: ['HOW ENTERPRISES GO ON CHAIN', '上链说明', '上链不是把企业名称放进图谱，而是确认主体、能力、角色和证据边界。'],
  solution: ['INDUSTRY CHAIN SOLUTIONS', '解决方案', '围绕产业链梳理、标准化上链、可视化呈现与数据交付，提供可落地的定制服务。']
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
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
  return ($('#graphSearch').value || '').trim().toLowerCase();
}

function updateFilterChips() {
  const row = $('#activeFilterRow');
  const filters = [
    ['industryType', '产业类型', $('#industryType').value, '不限'],
    ['industryName', '产业名称', $('#industryName').value, '不限'],
    ['provinceSelect', '产业体系', $('#provinceSelect').value, '不限']
  ];
  row.innerHTML = `<span class="active-filter-label">当前条件</span>${filters.filter(([, , value, empty]) => value && value !== empty).map(([id, label, value]) => `<button class="filter-chip" type="button" data-clear-filter="${id}">${escapeHtml(label)}：${escapeHtml(value)} ${icon('x', 'ui-icon tiny')}</button>`).join('')}<span class="filter-note">搜索范围：节点名称、企业名称</span>`;
  if (filters.every(([, , value, empty]) => !value || value === empty)) row.querySelector('.filter-note').textContent = '搜索范围：节点名称、企业名称';
  $$('[data-clear-filter]', row).forEach((button) => button.addEventListener('click', () => {
    const select = $(`#${button.dataset.clearFilter}`);
    if (!select) return;
    select.value = select.id === 'evidenceFilter' ? '全部证据' : '不限';
    if (select.id === 'industryType' || select.id === 'industryName' || select.id === 'provinceSelect') {
      if (select.id === 'industryType') populateIndustryNameOptions(false);
      if (select.id === 'industryName') populateProvinceOptions(true);
      if (select.id === 'provinceSelect') populateIndustryNameOptions(true);
      populateProvinceOptions(true);
      populateRegionScopeOptions(true);
    }
    syncFilterControl(select);
    updateFilterChips();
    applyGraphFilters();
  }));
}

function getFilterContext() {
  const province = $('#provinceSelect').value;
  const region = regionCatalog.find((item) => item.province === province);
  const name = $('#industryName').value;
  const type = $('#industryType').value;
  const area = $('#regionScope')?.value || '不限';
  const parts = [];
  if (province === '不限') parts.push('全国 31 省市');
  else parts.push(`${province} · ${region?.system || '官方产业体系'}`);
  if (area !== '不限') parts.push(area);
  if (type !== '不限') parts.push(type);
  if (name !== '不限') parts.push(name);
  return parts.join(' · ');
}

function getAdvancedFilterValues() {
  const intellectualPropertySelect = $('#intellectualPropertyFilter');
  return {
    honor: $('#honorFilter')?.value || '不限',
    evidence: $('#evidenceFilter')?.value || '全部证据',
    listed: $('#listedFilter')?.value || '不限',
    intellectualProperty: intellectualPropertySelect?.multiple
      ? getMultiSelectValues(intellectualPropertySelect)
      : [intellectualPropertySelect?.value || '不限']
  };
}

function companyMatchesRegionScope(company) {
  const { province, city, district } = regionScopeState;
  return (province === '不限' || company.province === province) &&
    (city === '不限' || company.city === city) &&
    (district === '不限' || company.district === district);
}

function companyMatchesAdvancedFilters(company) {
  const { honor, evidence, listed, intellectualProperty } = getAdvancedFilterValues();
  const intellectualPropertyValues = intellectualProperty.filter((value) => value !== '不限');
  return companyMatchesRegionScope(company) &&
    (honor === '不限' || (company.honors || []).includes(honor)) &&
    (evidence === '全部证据' || company.evidence === evidence) &&
    (listed === '不限' || company.listed === listed) &&
    (!intellectualPropertyValues.length || intellectualPropertyValues.some((value) => (company.intellectualProperty || []).includes(value)));
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
  if (!pickerPanel || !pickerView || !selectedView || !tabs) return;
  pickerPanel.classList.toggle('is-selected', selected);
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
  $('#chainPickerList')?.focus?.();
}

function renderChainPicker(profile) {
  const entries = getAvailableIndustryEntries();
  const selectedIndustry = chainSelectionActive ? ensureCurrentIndustry(entries) : '';
  const type = $('#industryType').value;
  const regionCount = getCatalogMatches().length;
  setChainSelectionMode(chainSelectionActive);
  $('#chainPickerCount').textContent = `${entries.length} 条`;
  $('#chainPickerContext').textContent = `${getFilterContext()} · ${regionCount} 个省市有对应官方命名`;
  $('#chainPickerList').innerHTML = entries.length ? entries.map((entry) => {
    const entryProfile = industryProfiles[entry.name] || (entry.name === '集成电路' ? industryProfiles['半导体与集成电路'] : null);
    const isSelected = chainSelectionActive && entry.name === selectedIndustry;
    const detail = entryProfile ? `${entryProfile.stages.length} 个一级环节 · ${semiconductorNodes.length} 个二级环节` : '暂无图谱明细数据';
    const typeLabel = entry.types.filter((entryType) => type === '不限' || entryType === type).join('、');
    const companyCount = entryProfile ? new Set(getProfileCompanyRecords(entryProfile).map((company) => company.name)).size : 0;
    const companyLabel = entryProfile ? `${companyCount.toLocaleString('zh-CN')} 家企业` : '暂无上链企业数据';
    return `<button class="chain-picker-item ${isSelected ? 'selected' : ''}" type="button" data-industry="${escapeHtml(entry.name)}" aria-pressed="${isSelected}"><span class="picker-item-icon">${icon(entryProfile ? 'link' : 'layers', 'ui-icon')}</span><span class="picker-item-copy"><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(detail)}</small><em>${escapeHtml(typeLabel || '官方产业体系名称')} · ${escapeHtml(companyLabel)}</em></span>${icon('chevron-right', 'ui-icon mini picker-item-arrow')}</button>`;
  }).join('') : '<div class="empty-chain-list">当前筛选条件没有对应的官方产业链名称</div>';
  if (chainSelectionActive) renderSelectedChain(profile);
  $$('.chain-picker-item').forEach((button) => button.addEventListener('click', () => {
    currentIndustry = button.dataset.industry;
    setChainSelectionMode(true);
    renderGraph();
    setWorkbenchSection('graphSection');
  }));
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

function renderCompanyList(profile = getProfile()) {
  const list = $('#onchainCompanyList');
  if (!list) return;
  const baseRecords = getProfileCompanyRecords(profile);
  const records = getVisibleCompanyRecords(profile);
  const uniqueTotal = new Set(baseRecords.map((company) => company.name)).size;
  const visibleTotal = new Set(records.map((company) => company.name)).size;
  const visibleRecords = records.slice(0, 32);
  $('#companyListTotal').textContent = visibleTotal.toLocaleString('zh-CN');
  $('#companyListScope').textContent = profile
    ? `展示“${profile.title}”当前筛选下的代表企业样本，点击企业所在环节可查看完整清单与证据。`
    : '当前筛选只有官方产业体系命名，暂未接入对应的企业清单。';
  $('#companyListSummary').textContent = records.length > visibleRecords.length
    ? `显示 ${visibleRecords.length} / ${records.length} 家匹配企业，更多结果可通过关键词或高级筛选继续缩小范围`
    : `显示 ${records.length} / ${uniqueTotal} 家匹配企业`;
  if (!visibleRecords.length) {
    list.innerHTML = '<div class="company-list-empty"><div class="empty-graph-icon">' + icon('building', 'ui-icon') + '</div><strong>当前条件暂无企业清单</strong><p>可放宽产业、关键词或高级筛选条件后继续查看。</p></div>';
    return;
  }
  list.innerHTML = `<div class="company-list-head"><span></span><span>企业摘要</span><span>企业与环节对应关系</span><span></span></div>${visibleRecords.map((company, index) => `<article class="company-list-row"><span class="company-list-index">${String(index + 1).padStart(2, '0')}</span><div class="company-list-summary"><div class="company-title"><strong>${escapeHtml(company.displayName || company.name)}</strong><span class="score-badge ${company.score.toLowerCase()}">${escapeHtml(company.score)}</span></div><div class="company-profile-meta"><span title="注册时间">${escapeHtml(company.registeredDate || '—')}</span><span title="注册资本">${escapeHtml(company.registeredCapital || '—')}</span><span title="注册地址">${escapeHtml(company.registeredAddress || `${company.province} · 模拟地址`)}</span></div><div class="company-tags"><span class="company-status">${escapeHtml(company.operatingStatus || '在营')}</span><span class="${company.evidence === '强证据' ? 'evidence-strong' : 'evidence-pending'}">${escapeHtml(company.evidence)}</span><span class="company-listed">${company.listed === '是' ? '已上市' : '未上市'}</span>${(company.honors || []).map((honor) => `<span class="company-honor">${escapeHtml(honor)}</span>`).join('')}</div></div><div class="company-list-relation"><span class="company-relation-label">所属环节</span><strong>${escapeHtml(company.stage || '产业链环节')} · ${escapeHtml(company.node)}</strong><small title="${escapeHtml(company.industryPath || '产业链节点')}">${escapeHtml(company.industryPath || '产业链节点')}</small></div><button class="icon-button subtle company-list-more" type="button" data-node="${escapeHtml(company.node)}" aria-label="查看${escapeHtml(company.node)}企业清单" title="查看所在环节企业清单">${icon('chevron-right', 'ui-icon mini')}</button></article>`).join('')}`;
  $$('.company-list-more', list).forEach((button) => button.addEventListener('click', () => openDrawer(button.dataset.node)));
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
  $('#analysisScope').textContent = profile ? `基于“${profile.title}”当前筛选结果，查看区域覆盖、企业结构与环节分布。` : '当前筛选只有官方产业体系命名，暂无对应的产业链分析数据。';
  $('#analysisScopeContext').textContent = `${profile?.title || currentIndustry || '当前产业'} · ${getFilterContext()}`;
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

function renderMetricBars(id, entries, emptyText = '当前条件暂无数据') {
  const container = $(`#${id}`);
  if (!container) return;
  const max = Math.max(...entries.map(([, value]) => value), 0);
  container.innerHTML = entries.length
    ? entries.map(([label, value], index) => `<div class="metric-bar-row"><span>${escapeHtml(label)}</span><i><b class="metric-bar-fill-${index % 4}" style="width:${max && value ? Math.max(5, Math.round(value / max * 100)) : 0}%"></b></i><strong>${value.toLocaleString('zh-CN')} 家</strong></div>`).join('')
    : `<div class="metric-empty">${escapeHtml(emptyText)}</div>`;
}

const analysisTrendYears = [2022, 2023, 2024, 2025, 2026];

function buildCumulativeTrend(total) {
  const weights = [0.52, 0.65, 0.77, 0.89, 1];
  return analysisTrendYears.map((year, index) => [String(year), total ? Math.max(1, Math.round(total * weights[index])) : 0]);
}

function renderTrendChart(id, entries, emptyText = '当前条件暂无数据') {
  const container = $(`#${id}`);
  if (!container) return;
  const max = Math.max(...entries.map(([, value]) => value), 0);
  container.innerHTML = entries.length
    ? `<div class="trend-chart-grid">${entries.map(([label, value], index) => `<div class="trend-column"><span>${value.toLocaleString('zh-CN')}</span><i><b class="metric-bar-fill-${index % 4}" style="height:${max && value ? Math.max(8, Math.round(value / max * 100)) : 0}%"></b></i><small>${escapeHtml(label)}</small></div>`).join('')}</div>`
    : `<div class="metric-empty">${escapeHtml(emptyText)}</div>`;
}

function renderAnalysis(profile = getProfile()) {
  const records = getVisibleCompanyRecords(profile);
  const companies = getUniqueCompanyRecords(records);
  const total = companies.length;
  const coreCompanies = companies.filter((company) => company.type === '核心产品企业').length;
  const potentialCompanies = Math.max(0, total - coreCompanies);
  const corePercent = total ? Math.round(coreCompanies / total * 1000) / 10 : 0;
  const provinceCounts = new Map();
  companies.forEach((company) => provinceCounts.set(company.province, (provinceCounts.get(company.province) || 0) + 1));
  const topProvinces = [...provinceCounts].sort(([, first], [, second]) => second - first);
  const stageCounts = new Map((profile?.stages || []).map((stage) => [stage.title, 0]));
  records.forEach((company) => stageCounts.set(company.stage, (stageCounts.get(company.stage) || 0) + 1));
  const topStage = [...stageCounts].sort(([, first], [, second]) => second - first)[0];
  const topProvince = topProvinces[0];
  const secondProvince = topProvinces[1];
  const evidenceCounts = ['强证据', '待补证'].map((label) => [label, companies.filter((company) => company.evidence === label).length]);
  const capitalBuckets = [['100万以内', 0], ['100万-500万元', 0], ['500万-1000万元', 0], ['1000万-2000万元', 0], ['2000万-5000万元', 0], ['1-5亿元', 0], ['5亿元以上', 0]];
  companies.forEach((company) => {
    const capital = Number.parseFloat(String(company.registeredCapital || '').replace(/,/g, '')) || 0;
    const capitalIndex = capital < 0.01 ? 0 : capital < 0.05 ? 1 : capital < 0.1 ? 2 : capital < 0.2 ? 3 : capital < 0.5 ? 4 : capital < 5 ? 5 : 6;
    capitalBuckets[capitalIndex][1] += 1;
  });

  $('#analysisScope').textContent = profile
    ? `基于“${profile.title}”当前可见企业样本，观察区域分布、企业结构、发展阶段与关键环节。`
    : '当前筛选只有官方产业体系命名，暂无对应的产业链分析数据。';
  $('#analysisScopeContext').textContent = `${profile?.title || currentIndustry || '当前产业'} · ${getFilterContext()}`;
  $('#analysisStoryTitle').textContent = total
    ? `${topProvince?.[0] || '当前区域'}的企业样本相对集中，${topStage?.[0] || '产业环节'}关联度较高`
    : '选择产业链后生成产业特征';
  $('#analysisStoryText').textContent = total
    ? `当前筛选得到 ${total.toLocaleString('zh-CN')} 家去重企业样本，${topProvince?.[0] || '主要地区'}有 ${topProvince?.[1] || 0} 家${secondProvince ? `，${secondProvince[0]}有 ${secondProvince[1]} 家` : ''}；${topStage?.[0] || '主要环节'}关联 ${topStage?.[1] || 0} 家。核心产品企业占 ${formatAnalysisPercent(coreCompanies, total)}。`
    : '请先选择一条有图谱明细的产业链，或放宽当前企业筛选条件。';
  $('#analysisRegionCount').textContent = `${provinceCounts.size} 个省市`;
  $('#distributionCompanyTotal').textContent = total.toLocaleString('zh-CN');
  $('#distributionProvinceTotal').textContent = provinceCounts.size.toLocaleString('zh-CN');
  $('#distributionCoreTotal').textContent = coreCompanies.toLocaleString('zh-CN');
  $('#companyMixTotal').textContent = total.toLocaleString('zh-CN');
  $('#companyMixChart').style.setProperty('--core-pct', `${corePercent}%`);
  $('#companyCorePct').textContent = formatAnalysisPercent(coreCompanies, total);
  $('#companyPotentialPct').textContent = formatAnalysisPercent(potentialCompanies, total);
  renderMetricBars('analysisEvidenceBars', evidenceCounts);
  renderTrendChart('listingTrendChart', buildCumulativeTrend(total));
  $('#listingTrendNote').textContent = total ? `2022—2026 年度累计样本 · 最新年度 ${total.toLocaleString('zh-CN')} 家` : '当前筛选条件暂无企业样本';
  renderMetricBars('analysisCapitalBars', capitalBuckets);
  const stages = (profile?.stages || []).map((stage) => ({ ...stage, value: stageCounts.get(stage.title) || 0 }));
  const maxStageValue = Math.max(...stages.map((stage) => stage.value), 0);
  $('#analysisStageBars').innerHTML = stages.length ? stages.map((stage) => `<div><span>${escapeHtml(stage.title)}</span><i><b class="${stage.color}-fill" style="height: ${maxStageValue ? Math.max(stage.value ? 8 : 0, Math.round(stage.value / maxStageValue * 100)) : 0}%"></b></i><strong>${stage.value.toLocaleString('zh-CN')}</strong></div>`).join('') : '<div class="stage-empty">暂无环节记录</div>';
  $('#analysisStageAxis').textContent = maxStageValue ? Math.round(maxStageValue / 2).toLocaleString('zh-CN') : '—';
  $('#analysisStageAxis').nextElementSibling.textContent = maxStageValue ? maxStageValue.toLocaleString('zh-CN') : '—';
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
    $('#queryResult').textContent = entries.length
      ? `已筛选 ${entries.length} 条产业链，请选择后查看图谱`
      : '当前筛选条件没有对应的官方产业链名称';
    updateFilterChips();
    renderAnalysis(null);
    return;
  }
  $('#graphTitle').textContent = currentIndustry || '未选择产业链';
  if (!profile) {
    $('#graphNodeCount').textContent = '—';
    $('#graphCompanyCount').textContent = '—';
    $('#mapLegend').innerHTML = '';
    chainMap.innerHTML = `<div class="empty-graph-state"><div class="empty-graph-icon">${icon('layers', 'ui-icon')}</div><strong>${escapeHtml(currentIndustry || '当前筛选')}</strong><p>当前筛选结果只有官方产业体系命名，暂无对应的产业链明细工作簿。</p><small>可继续调整筛选条件，或选择“集成电路 / 半导体与集成电路”查看已接入图谱。</small></div>`;
    $('#queryResult').textContent = query ? `当前产业暂无图谱明细，无法查找“${query}”` : `已选择 ${currentIndustry || '当前筛选'} · 暂无图谱明细数据`;
    updateFilterChips();
    renderAnalysis(null);
    return;
  }
  const visibleCompanyTotal = new Set(getVisibleCompanyRecords(profile).map((company) => company.name)).size;
  $('#graphNodeCount').textContent = profile.nodeCount.toLocaleString('zh-CN');
  $('#graphCompanyCount').textContent = visibleCompanyTotal.toLocaleString('zh-CN');
  $('#mapLegend').innerHTML = '<span class="legend-explainer"><i class="legend-focus-mark"></i>核心环节</span><span class="legend-explainer"><i class="legend-support-mark"></i>产业配套</span>';
  const companyMatchNodes = new Set(nodeCompanies.filter((company) => company.name.toLowerCase().includes(query)).map((company) => company.node));
  chainMap.innerHTML = profile.stages.map((stage, index) => {
    const stageNodes = stage.nodes;
    const stageCountLabel = `${stage.count} 类`;
    return `<div class="stage-column ${stage.color} ${index > 0 ? 'connected-stage' : ''}"><div class="stage-heading"><div><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.subtitle)}</small></div><b>${stageCountLabel}</b></div><div class="node-list">${stageNodes.length ? stageNodes.map((node) => {
      const searchable = node.searchable.toLowerCase();
      const matches = query && (searchable.includes(query) || companyMatchNodes.has(node.name));
      const companyTotal = getNodeVisibleCompanyCount(node);
      const hasCompanies = companyTotal > 0;
      const roleLabel = node.featured ? '核心环节' : '配套环节';
      return `<article class="node-card ${node.featured ? 'featured' : ''} ${hasCompanies ? 'has-companies' : ''} ${matches ? 'search-match' : ''}"><button class="node-card-main" type="button" data-node="${escapeHtml(node.name)}"><span class="node-card-top"><i class="node-role-dot ${node.featured ? 'is-core' : 'is-support'}" title="${roleLabel}" aria-label="${roleLabel}"></i><span class="node-card-company-count">上链企业 ${companyTotal.toLocaleString('zh-CN')} 家</span></span><strong>${escapeHtml(node.name)}</strong></button>${renderNodeHierarchy(node)}</article>`;
    }).join('') : '<div class="empty-node-list">暂无符合条件的环节</div>'}</div></div>`;
  }).join('');
  $$('.node-card-main', chainMap).forEach((button) => button.addEventListener('click', () => openDrawer(button.dataset.node)));
  $$('.node-path-item', chainMap).forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    openDrawer(button.dataset.node, button.dataset.path);
  }));
  $('#queryResult').textContent = query ? `正在查找“${query}”` : `已加载 ${profile.title} · ${getFilterContext()}`;
  updateFilterChips();
  renderAnalysis(profile);
}

function applyGraphFilters() {
  renderGraph();
  if (chainSelectionActive) $('#queryResult').textContent = `已加载 ${currentIndustry} · ${getFilterContext()}`;
}

function buildNodeHierarchy(paths, corePaths = []) {
  const roots = [];
  const corePathSet = new Set(corePaths.filter(Boolean));
  paths.filter(Boolean).forEach((path) => {
    const levels = path.split(/\s*>\s*/).map((level) => level.trim()).filter(Boolean);
    let siblings = roots;
    levels.forEach((name, levelIndex) => {
      let item = siblings.find((candidate) => candidate.name === name);
      if (!item) {
        item = { name, children: [], isCore: false };
        siblings.push(item);
      }
      item.isCore = item.isCore || corePathSet.has(levels.slice(0, levelIndex + 1).join(' > '));
      siblings = item.children;
    });
  });
  return roots;
}

function renderNodeHierarchyTree(items, nodeName, parentPath = []) {
  return `<ul class="node-path-tree">${items.map((item) => {
    const path = [...parentPath, item.name].join(' > ');
    return `<li><button class="node-path-item ${item.isCore ? 'is-core' : ''}" type="button" data-node="${escapeHtml(nodeName)}" data-path="${escapeHtml(path)}" aria-label="查看${escapeHtml(path)}的企业清单"><span class="node-path-name"><i class="node-path-dot ${item.isCore ? 'is-core' : ''}"></i>${escapeHtml(item.name)}</span>${icon('chevron-right', 'ui-icon mini')}</button>${item.children.length ? renderNodeHierarchyTree(item.children, nodeName, [...parentPath, item.name]) : ''}</li>`;
  }).join('')}</ul>`;
}

function renderNodeHierarchy(node) {
  const paths = Array.isArray(node.paths) ? node.paths.filter(Boolean) : [];
  if (!paths.length) return '<span class="node-path-empty">暂无更细分路径</span>';
  return `<details class="node-path-details"><summary><span>${icon('chevron-down', 'ui-icon mini')}展开细分环节</span><small>${paths.length} 条路径</small></summary><div class="node-path-body">${renderNodeHierarchyTree(buildNodeHierarchy(paths, node.corePaths), node.name)}</div></details>`;
}

function runGraphSearch() {
  const query = getSearchText();
  if (!query) { renderGraph(); showToast('请输入环节节点或企业名称'); return; }
  if (!chainSelectionActive) {
    $('#queryResult').textContent = '请先选择一条产业链，再搜索节点或企业';
    showToast('请先选择一条产业链');
    return;
  }
  const profile = getProfile();
  if (!profile) {
    $('#queryResult').textContent = `当前产业暂无图谱明细，无法查找“${query}”`;
    showToast('当前产业暂无图谱明细数据');
    return;
  }
  const nodes = getAllNodes(profile);
  const company = nodeCompanies.find((item) => `${item.name}${item.displayName || ''}`.toLowerCase().includes(query));
  const node = nodes.find((item) => (item.nodeSearchable || item.name).toLowerCase().includes(query));
  renderGraph();
  if (company) {
    $('#queryResult').textContent = `找到企业：${company.name}`;
    openDrawer(company.node);
    $('#drawerSearch').value = company.name;
    renderDrawerCompanies();
    showToast(`已打开「${company.name}」所在环节的企业清单`);
  } else if (node) {
    $('#queryResult').textContent = `找到环节：${node.name}${node.paths?.[0] ? ` · ${node.paths[0]}` : ''}`;
    const matchedCard = $$('.node-card').find((card) => card.dataset.node === node.name);
    matchedCard?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    showToast(`已定位环节「${node.name}」，点击节点可查看企业清单`);
  } else {
    $('#queryResult').textContent = `未找到与“${query}”相关的节点或企业`;
    showToast('未找到匹配结果，请调整关键词或筛选条件');
  }
}

function openDrawer(nodeName, subpath = '') {
  const profileNode = getAllNodes().find((node) => node.name === nodeName);
  if (!profileNode) return;
  currentNode = profileNode;
  currentNodePath = subpath;
  const companyRecords = nodeCompanies.filter((company) => company.node === profileNode.name);
  const representativeCount = profileNode.companyNames?.length ?? companyRecords.length;
  const backdrop = $('#drawerBackdrop');
  $('#drawerTitle').textContent = subpath ? subpath.split(' > ').slice(-1)[0] : profileNode.name;
  const drawerContext = subpath ? `细分路径：${subpath}` : profileNode.meta;
  $('#drawerSubtitle').textContent = `${profileNode.stage} · ${drawerContext} · ${representativeCount.toLocaleString('zh-CN')} 家代表企业`;
  $('#drawerCompanyTotal').textContent = representativeCount.toLocaleString('zh-CN');
  $('#drawerStrongTotal').textContent = (profileNode.coreCount ?? 0).toLocaleString('zh-CN');
  $('#drawerProvinceTotal').textContent = (profileNode.rowCount ?? 0).toLocaleString('zh-CN');
  const provinces = [...new Set(['不限', ...companyRecords.map((company) => company.province).filter(Boolean)])];
  setSelectOptions($('#drawerProvince'), provinces.map((province) => [province, province === '不限' ? '省份' : province]));
  $('#drawerSearch').value = '';
  $('#drawerProvince').value = '不限';
  $('#drawerType').value = '全部类型';
  $('#drawerEvidence').value = '全部证据';
  ['#drawerProvince', '#drawerType', '#drawerEvidence'].forEach((selector) => syncCustomSelect($(selector)));
  backdrop.hidden = false;
  document.body.classList.add('drawer-open');
  renderDrawerCompanies();
}

function renderDrawerCompanies() {
  if (!currentNode) return;
  const query = ($('#drawerSearch').value || '').trim().toLowerCase();
  const province = $('#drawerProvince').value;
  const type = $('#drawerType').value;
  const evidence = $('#drawerEvidence').value;
  const companyRecords = nodeCompanies.filter((company) => company.node === currentNode.name);
  const list = companyRecords.filter((company) => (!query || `${company.name}${company.displayName || ''}${company.node}${company.detail}`.toLowerCase().includes(query)) && (province === '不限' || company.province === province) && (type === '全部类型' || company.type === type) && (evidence === '全部证据' || company.evidence === evidence));
  const total = currentNode.companyNames?.length ?? companyRecords.length;
  $('#drawerFilterResult').textContent = `显示 ${list.length} / ${total} 家`;
  $('#drawerCompanyList').innerHTML = list.length ? list.map((company) => `<article class="company-result"><div class="company-result-main"><div class="company-title"><strong>${escapeHtml(company.displayName || company.name)}</strong><span class="score-badge ${company.score.toLowerCase()}">${escapeHtml(company.score)}</span></div><div class="company-profile-meta"><span title="注册时间">${escapeHtml(company.registeredDate || '—')}</span><span title="注册资本">${escapeHtml(company.registeredCapital || '—')}</span><span title="注册地址">${escapeHtml(company.registeredAddress || `${company.province} · 模拟地址`)}</span></div><div class="company-tags"><span class="company-status">${escapeHtml(company.operatingStatus || '在营')}</span><span class="${company.evidence === '强证据' ? 'evidence-strong' : 'evidence-pending'}">${escapeHtml(company.evidence)}</span><span class="company-listed">${company.listed === '是' ? '已上市' : '未上市'}</span>${(company.honors || []).map((honor) => `<span class="company-honor">${escapeHtml(honor)}</span>`).join('')}</div></div><button class="icon-button subtle company-more" type="button" data-company-name="${escapeHtml(company.displayName || company.name)}" aria-label="查看企业详情" title="查看企业详情">${icon('chevron-right', 'ui-icon mini')}</button></article>`).join('') : '<div class="empty-state">没有符合当前筛选的企业<br/><small>可以清空条件，或放宽证据强度。</small></div>';
  $$('.company-more', $('#drawerCompanyList')).forEach((button) => button.addEventListener('click', () => showToast(`已打开 ${button.dataset.companyName} 的企业画像`)));
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
  if (view === 'graph') setWorkbenchSection('graphSection');
}

function selectProvinceOnMap(province) {
  const select = $('#provinceSelect');
  if (!select || !province || ![...select.options].some((option) => option.value === province)) return;
  select.value = province;
  syncCustomSelect(select);
  populateIndustryNameOptions(false);
  populateProvinceOptions(true);
  setView('graph');
  applyGraphFilters();
}

function renderDistribution(companies = getVisibleCompanyRecords()) {
  const counts = new Map();
  companies.forEach((company) => counts.set(company.province, (counts.get(company.province) || 0) + 1));
  const currentDistribution = [...counts].sort(([, first], [, second]) => second - first);
  const max = Math.max(...currentDistribution.map(([, count]) => count), 1);
  if (!chinaMapProjection) renderChinaMapBase();
  $('#provinceTop10').innerHTML = currentDistribution.length
    ? currentDistribution.slice(0, 10).map(([province, count], index) => `<div class="metric-bar-row"><span><em>${String(index + 1).padStart(2, '0')}</em>${escapeHtml(province.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区/g, ''))}</span><i><b class="metric-bar-fill-${index % 4}" style="width:${Math.max(6, Math.round(count / max * 100))}%"></b></i><strong>${count.toLocaleString('zh-CN')} 家</strong></div>`).join('')
    : '<div class="metric-empty">当前条件暂无企业样本</div>';
  $('#provinceMapPoints').innerHTML = currentDistribution.map(([province, count]) => {
    const coordinate = chinaProvinceCenters.get(province);
    const projected = coordinate && chinaMapProjection ? chinaMapProjection(coordinate) : null;
    const position = mapLocations[province];
    if (!projected && !position) return '';
    const ratio = count / max;
    const level = ratio >= .7 ? 4 : ratio >= .45 ? 3 : ratio >= .22 ? 2 : 1;
    const label = province.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区/g, '');
    const diameter = 12 + Math.round(ratio * 13);
    const left = projected ? projected.x / 10 : position[0] / 6;
    const top = projected ? projected.y / 6.2 : position[1] / 4;
    return `<button class="province-map-point level-${level}" type="button" style="left:${left}%;top:${top}%" data-province="${escapeHtml(province)}" title="${escapeHtml(province)} ${count} 家上链企业" aria-label="${escapeHtml(province)} ${count} 家上链企业"><i style="width:${diameter}px;height:${diameter}px"></i><span>${escapeHtml(label)} <b>${count}</b></span></button>`;
  }).join('');
  $$('.province-map-point').forEach((point) => point.addEventListener('click', () => {
    selectProvinceOnMap(point.dataset.province);
  }));
}

function handleCatalogFilterChange(id) {
  if (chainSelectionActive) {
    setChainSelectionMode(false);
    currentIndustry = '';
  }
  if (id === 'industryType') {
    populateIndustryNameOptions(false);
    populateProvinceOptions(true);
  } else if (id === 'industryName') {
    populateProvinceOptions(true);
  } else if (id === 'provinceSelect') {
    populateIndustryNameOptions(true);
    populateProvinceOptions(true);
  }
  populateRegionScopeOptions(true);
  applyGraphFilters();
}

function getActiveConversation() {
  return aiConversations.find((conversation) => conversation.id === activeConversationId) || aiConversations[0];
}

function getAiContextSnapshot() {
  const industry = currentIndustry || $('#industryName')?.value || '半导体与集成电路';
  const province = $('#provinceSelect')?.value || '不限';
  const region = regionCatalog.find((item) => item.province === province);
  const regionLabel = province === '不限' ? '全国 31 省市' : `${province}${region?.system ? ` · ${region.system}` : ''}`;
  const regionScopeLabel = getRegionScopeLabel();
  const { honor, evidence, listed, intellectualProperty } = getAdvancedFilterValues();
  const intellectualPropertySelect = $('#intellectualPropertyFilter');
  const intellectualPropertyValues = intellectualPropertySelect?.multiple
    ? getMultiSelectDisplayValues(intellectualPropertySelect).filter((value) => value !== '不限')
    : intellectualProperty.filter((value) => value !== '不限');
  const activeFilters = [
    regionScopeLabel !== '不限' ? `区域：${regionScopeLabel}` : '',
    honor !== '不限' ? `荣誉：${honor}` : '',
    evidence !== '全部证据' ? `证据：${evidence}` : '',
    listed !== '不限' ? `上市：${listed}` : '',
    intellectualPropertyValues.length ? `知识产权：${intellectualPropertyValues.join('、')}` : ''
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

function updateSourceCount() {
  const checked = $$('[data-source]').filter((input) => input.checked).length;
  $('#enabledSourceCount').textContent = `${checked} / 6 已启用`;
  $$('[data-source]').forEach((input) => input.closest('.source-tool').classList.toggle('enabled', input.checked));
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
}

function setGraphFullscreen(isFullscreen) {
  const graphBoard = $('.graph-board');
  const filters = $('#advancedFilters');
  const normalSlot = $('#selectedChainFiltersSlot');
  const fullscreenSlot = $('#fullscreenFilterSlot');
  if (!graphBoard || !filters || !normalSlot || !fullscreenSlot) return;
  graphBoard.classList.toggle('fullscreen-map', isFullscreen);
  document.body.classList.toggle('fullscreen-open', isFullscreen);
  (isFullscreen ? fullscreenSlot : normalSlot).append(filters);
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
  $('#clearGraphSearch').addEventListener('click', () => { $('#graphSearch').value = ''; renderGraph(); $('#graphSearch').focus(); });
  $('#industryType').addEventListener('change', () => handleCatalogFilterChange('industryType'));
  $('#industryName').addEventListener('change', () => handleCatalogFilterChange('industryName'));
  $('#provinceSelect').addEventListener('change', () => handleCatalogFilterChange('provinceSelect'));
  ['#honorFilter', '#evidenceFilter', '#listedFilter', '#intellectualPropertyFilter', '#regionScope'].forEach((selector) => $(selector).addEventListener('change', () => { syncAdvancedOptionGroup($(selector)); updateFilterChips(); applyGraphFilters(); }));
  $('#clearAdvancedFilters').addEventListener('click', () => { $('#honorFilter').value = '不限'; $('#evidenceFilter').value = '全部证据'; $('#listedFilter').value = '不限'; setMultiSelectValues($('#intellectualPropertyFilter'), ['不限']); resetRegionScopePicker(); ['#honorFilter', '#evidenceFilter', '#listedFilter', '#intellectualPropertyFilter', '#regionScope'].forEach((selector) => syncFilterControl($(selector))); updateFilterChips(); applyGraphFilters(); showToast('高级筛选条件已清空'); });
  $('#changeChainButton').addEventListener('click', () => { showChainPicker(); showToast('请选择要查看的产业链'); });
  $('#fullscreenButton').addEventListener('click', () => setGraphFullscreen(!$('.graph-board').classList.contains('fullscreen-map')));
  $('#closeDrawer').addEventListener('click', closeDrawer);
  $('#drawerBackdrop').addEventListener('click', (event) => { if (event.target === $('#drawerBackdrop')) closeDrawer(); });
  ['#drawerSearch', '#drawerProvince', '#drawerType', '#drawerEvidence'].forEach((selector) => $(selector).addEventListener('input', renderDrawerCompanies));
  $('#clearDrawerFilters').addEventListener('click', () => { $('#drawerSearch').value = ''; $('#drawerProvince').value = '不限'; $('#drawerType').value = '全部类型'; $('#drawerEvidence').value = '全部证据'; ['#drawerProvince', '#drawerType', '#drawerEvidence'].forEach((selector) => syncCustomSelect($(selector))); renderDrawerCompanies(); });
  $('#drawerExportButton').addEventListener('click', () => showToast('企业清单导出任务已创建'));
  $('#sendChatButton').addEventListener('click', sendChat);
  $('#chatInput').addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendChat(); } });
  $$('.topic-button').forEach((button) => button.addEventListener('click', () => { $('#chatInput').value = button.dataset.prompt; sendChat(); }));
  $('#clearChatButton').addEventListener('click', clearActiveConversation);
  $('#newConversationButton').addEventListener('click', createConversation);
  $('#logicInfoButton').addEventListener('click', () => showToast('企业角色与证据等级用于区分招商优先级，证据不足不会被直接判定为不属于'));
  $('#solutionContactButton').addEventListener('click', () => showToast('定制需求已记录，产业研究顾问将在 1 个工作日内联系您'));
  $('#solutionCtaButton').addEventListener('click', () => showToast('定制需求已记录，产业研究顾问将在 1 个工作日内联系您'));
  $('#solutionCatalogButton').addEventListener('click', () => setView('graph'));
  $$('[data-source]').forEach((input) => input.addEventListener('change', updateSourceCount));
  enhanceCustomSelects();
  ['#honorFilter', '#evidenceFilter', '#listedFilter', '#intellectualPropertyFilter', '#regionScope'].forEach((selector) => syncAdvancedOptionGroup($(selector)));
  updateSourceCount();
  renderConversationList();
  renderActiveConversation();
}

init();
