// ---------------------------------------------------------------------------
// 联机服务器配置
// 服务器板块的接口地址与展示文案统一在这里维护 —— 修改服务器信息时改这里即可。
// ---------------------------------------------------------------------------

// 服务器状态接口 Base URL（GET，返回 BONELAB Fusion 服务器状态 JSON）
export const SERVER_API_BASE_URL = 'http://s203.singsi.cn:19364';

// 状态接口路径
export const SERVER_API_STATUS_PATH = '/api/status';

// 完整状态接口地址
export const SERVER_API_STATUS_URL = `${SERVER_API_BASE_URL}${SERVER_API_STATUS_PATH}`;

// ---- 卡片展示信息（接口不提供的静态文案） ---------------------------------
export const SERVER_TAG = 'MIAR // PUBLIC';
export const SERVER_NAME = 'MIAR 官方联机服务器';
export const SERVER_DESCRIPTION = '【占位符】官方公共沙盒联机服务器，基于 Fusion Mod 运行。';

// ---- BONELAB 关卡 UUID → 地图名 -------------------------------------------
// 接口只返回关卡 UUID（currentLevel），想显示可读地图名请在这里补充映射；
// 未匹配到时显示 UUID 前 8 位。
export const LEVEL_NAMES: Record<string, string> = {
  // '关卡UUID': '地图名',
};
