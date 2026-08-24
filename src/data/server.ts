// ---------------------------------------------------------------------------
// 联机服务器配置
// 服务器板块的接口地址与展示文案统一在这里维护 —— 修改服务器信息时改这里即可。
// ---------------------------------------------------------------------------

export const SERVER_PROTOCOL = 'http://';

// 服务器状态接口 Base URL（GET，返回 BONELAB Fusion 服务器状态 JSON）
export const SERVER_API_BASE_URL = 's203.singsi.cn:19364';

// 状态接口路径
export const SERVER_API_STATUS_PATH = '/api/status';

// 完整状态接口地址
export const SERVER_API_STATUS_URL = `${SERVER_PROTOCOL}${SERVER_API_BASE_URL}${SERVER_API_STATUS_PATH}`;

// ---- 卡片展示信息（接口不提供的静态文案） ---------------------------------
export const SERVER_TAG = 'MIAR // PUBLIC';
export const SERVER_NAME = 'MIAR 官方联机服务器';
export const SERVER_DESCRIPTION = '使用自研的 Fusion 专用服务器插件，实现24小时在线，随时可以加入';

// ---- BONELAB 关卡 UUID → 地图名 -------------------------------------------
// 接口返回关卡条码（currentLevel，句点分隔），默认显示最后一段（如 VoidG114）；
// 有可读名时在这里补充映射，映射优先于默认行为。
export const LEVEL_NAMES: Record<string, string> = {
  // '关卡barcode': '地图名',
  'c2534c5a-80e1-4a29-93ca-f3254d656e75': '主菜单',
  'c2534c5a-4197-4879-8cd3-4a695363656e': '坠落',
  'c2534c5a-6b79-40ec-8e98-e58c5363656e': 'BONELAB枢纽',
  'c2534c5a-56a6-40ab-a8ce-23074c657665': '长跑',
  'c2534c5a-7601-4443-bdfe-7f235363656e': '大异常',
  'SLZ.BONELAB.Content.Level.LevelStreetPunch': '街头斗士',
  'SLZ.BONELAB.Content.Level.SprintBridge04': '高速桥段04',
  'SLZ.BONELAB.Content.Level.SceneMagmaGate': '岩浆闸门',
  'SLZ.BONELAB.Content.Level.MoonBase': '月球基地',
  'SLZ.BONELAB.Content.Level.LevelKartRace': 'Monogon高速路',
  'c2534c5a-c056-4883-ac79-e051426f6964': '巨柱攀登',
  'c2534c5a-db71-49cf-b694-24584c657665': '攀升',
  'SLZ.BONELAB.Content.Level.LevelOutro': '家',
  'fa534c5a868247138f50c62e424c4144.Level.VoidG114': 'Void G114',
  'fa534c5a83ee4ec6bd641fec424c4142.Level.LevelGunRange': '射击场',
  'fa534c5a83ee4ec6bd641fec424c4142.Level.LevelHoloChamber': '全息室',
  'fa534c5a83ee4ec6bd641fec424c4142.Level.LevelHalfwayPark': '中途公园',
  'SLZ.BONELAB.Content.Level.LevelMirror': '镜子',
  'c2534c5a-c6ac-48b4-9c5f-b5cd5363656e': '屋顶',
  'fa534c5a83ee4ec6bd641fec424c4142.Level.SceneparkourDistrictLogic': '霓虹跑酷',
  'c2534c5a-5c2f-4eef-a851-66214c657665': '地牢勇士',
  'c2534c5a-162f-4661-a04d-975d5363656e': '集装箱堆场',
  'fa534c5a868247138f50c62e424c4144.Level.LevelArenaMin': '奇幻竞技场',
  'fa534c5a83ee4ec6bd641fec424c4142.Level.LevelKartBowling': '巨骨保龄馆',
};
