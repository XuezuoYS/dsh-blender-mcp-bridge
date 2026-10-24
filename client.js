/**
 * Browser half of dsh-blender-mcp-bridge: the graphics configuration page.
 *
 * The page renders into the Settings page's `settings.section` slot and edits
 * the plugin's own settings files through GET/POST
 * `/api/blender-bridge/settings`; the DSH profile is no longer the store. Every
 * field is saved with one atomic mutation, so a half-finished form never
 * reaches the files. Copy is registered in the `blenderBridge` locale namespace.
 */

window.__ModuleLoader__.load({
  id: 'dsh-blender-mcp-bridge',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Locale namespace owned by this browser half. */
    const NS = 'blenderBridge'
    /** Host route that reports and installs the managed helper environment. */
    const ENV_ENDPOINT = '/api/blender-bridge/helper-env'
    /** Host route for the plugin's own settings files. */
    const SETTINGS_ENDPOINT = '/api/blender-bridge/settings'
    /** Display order for the four pinned packages. */
    const PACKAGE_ORDER = ['numpy', 'Pillow', 'opencv-python-headless', 'scipy']

    /** @type {Record<string, string>} */
    const zh = {
      title: 'Blender MCP 插件桥',
      navLabel: 'Blender MCP',
      tagline: '让 AI 在你打开的 Blender 会话里安全地工作',
      heroMeta: '保存到 DSH_HOME/dsh-blender-mcp-bridge/ 下的设置文件，立即生效',
      badgeLive: '保存后即时生效',
      badgeCustom: '已自定义',
      factSave: '插件不会保存 .blend，也不会退出 Blender；改动可用 Ctrl+Z 逐步撤销。',
      factSnapshot: '写入前按节奏自动快照，默认保留 3 份，可在下面调整；快照放在 .blend 旁。',
      factTimeout: '这里的超时只控制 DSH 的等待；渲染超时后 Blender 仍会继续，可用 render_status 取回。',
      sectionConnection: '连接与超时',
      sectionConnectionHint: 'Blender 官方 MCP 插件的本地地址，以及各类调用的默认等待时间。',
      sectionSnapshot: '快照与撤销',
      sectionSnapshotHint: '给长任务多留几个中途落脚点；快照不会改动当前打开的工程。',
      sectionSafety: '安全与审计',
      sectionSafetyHint: '守卫会拦截保存文件、退出 Blender、修改偏好等明显危险的调用。',
      sectionTask: '任务目录',
      sectionTaskHint: '插件只允许在任务目录内写文件；这里决定任务目录落在哪。',
      sectionHelperEnv: 'Python 辅助环境',
      sectionHelperEnvHint: '分析类 helper 共用这一套固定环境；装一次，之后自动识别，不再查找本机其它 Python。',
      sectionAdvanced: '高级与辅助分析',
      sectionAdvancedHint: '一般保持默认即可；helper 超时、输出上限和维护类开关只在排查问题时调整。',
      advancedShow: '展开高级设置',
      advancedHide: '收起高级设置',
      fieldHost: '监听地址',
      hostHint: 'Blender MCP 插件的本地监听地址，通常是 127.0.0.1。',
      fieldPort: '端口',
      portHint: '默认 9876，需与 Blender 插件设置里的端口一致。',
      fieldConnect: '连接超时',
      connectHint: '建立本地连接的最长等待，单位秒。',
      fieldResponse: '执行超时',
      responseHint: '普通 blender_mcp_exec 调用的默认等待，单位秒；单次调用可以覆盖。',
      fieldCapture: '截图超时',
      captureHint: '抓取视口截图的最长等待，单位秒。',
      fieldRender: '渲染超时',
      renderHint: '单次渲染的默认等待，单位秒；工具单次调用最长 30 分钟，超时后可继续取状态。',
      fieldSnapshotEnabled: '自动快照',
      snapshotEnabledHint: '在写入前自动保存一份当前会话副本，失败时不会继续写入。',
      fieldGenerations: '保留份数',
      generationsHint: '只保留最新的几份快照，1–20；越多越占磁盘。',
      fieldSnapshotOn: '触发节奏',
      snapshotOnHint: '自适应：首写、定期和删除前；每轮：每轮一张；每次写入：最稳但最慢。',
      fieldEveryWrites: '写入间隔',
      everyWritesHint: '自适应模式下每多少次写入补一张快照，1–100。',
      fieldOnDestructive: '删除前补拍',
      onDestructiveHint: '检测到删除类代码时，先补一张快照。',
      fieldCompress: '压缩快照',
      compressHint: '大场景开启可省磁盘，但写入会慢一些。',
      fieldSnapshotTimeout: '快照超时',
      snapshotTimeoutHint: '单次快照写入的等待上限，单位秒。',
      fieldGuard: '写入守卫',
      guardHint: '拦截保存文件、退出 Blender、修改偏好等明显危险的调用。',
      fieldAudit: '审计记录',
      auditHint: '把每次写操作和结果记到任务目录的审计日志。',
      fieldStoreCode: '记录完整代码',
      storeCodeHint: '审计里保存完整 Python 代码；默认只保留摘要。',
      fieldTaskRootMode: '目录模式',
      taskRootModeHint: '跟随 .blend：放在工程旁边；跟随工作区：放在当前工作区。',
      fieldTaskRoot: '自定义根目录',
      taskRootHint: '填写后优先使用；留空则按上面的模式自动选择。',
      fieldHelperBasePython: '底座 Python',
      helperBasePythonHint: '留空使用 Blender 自带的 Python；只在创建环境时使用。',
      fieldHelperPipIndex: 'pip 镜像',
      helperPipIndexHint: '留空使用 PyPI；可以填公司镜像或代理镜像。',
      fieldHelperTimeout: '辅助脚本超时',
      helperTimeoutHint: '分析类 helper 的最长运行时间，单位秒。',
      fieldHelperOutput: '辅助脚本输出上限',
      helperOutputHint: '单个 helper 保留的输出字符数。',
      fieldMaintenance: '维护类 helper',
      maintenanceHint: '启用安装、校验等维护脚本；只建议在排查问题时打开。',
      fieldResponseChars: '回复上限',
      responseCharsHint: '一次 Blender 回复允许的最大字符数，防止大结果占满上下文。',
      modeAdaptive: '自适应',
      modeTurn: '每轮',
      modeWrite: '每次写入',
      taskModeBlend: '跟随 .blend',
      taskModeWorkspace: '跟随工作区',
      unitSeconds: '秒',
      unitChars: '字符',
      save: '保存设置',
      saving: '保存中…',
      discard: '放弃改动',
      defaults: '恢复默认',
      reload: '重新载入',
      changeCount: '{count} 项待保存',
      statusClean: '没有未保存的修改',
      readOnly: '当前配置只读，暂时无法保存。',
      saved: '已保存，配置立即生效。',
      defaultsLoaded: '已载入默认值，记得保存。',
      loadingTitle: '正在读取插件配置…',
      loadingHint: '从插件自己的配置文件读取。',
      unavailableTitle: '配置表单暂不可用',
      unavailableHint: '设置通道不可用；可以直接编辑 DSH_HOME/dsh-blender-mcp-bridge/*.json，或刷新页面重试。',
      errorRequired: '请填写',
      errorRangeInt: '请输入 {min}–{max} 之间的整数',
      errorRangeSeconds: '请输入 {min}–{max} 秒',
      errorInvalid: '格式不正确',
      errorInvalidFields: '还有未填写或超出范围的设置。',
      errorSave: '保存失败：{message}',
      errorConflict: '配置已在别处更新，请重新载入后再保存。',
      errorBoundary: '这个设置区块遇到问题，插件本身不受影响。',
      errorBoundaryHint: '可以刷新页面重试，或直接编辑 DSH_HOME/dsh-blender-mcp-bridge/*.json。',
      customized: '已自定义',
      dirtyField: '有未保存的修改',
      rangeSeconds: '范围 {min}–{max} 秒',
      rangeMinSeconds: '至少 {min} 秒',
      rangeInt: '范围 {min}–{max}',
      rangeMinInt: '至少 {min} 字符',
      placeholderHost: '127.0.0.1',
      placeholderTaskRoot: '留空自动选择',
      placeholderBasePython: '留空使用 Blender 自带 Python',
      placeholderPipIndex: '留空使用 PyPI',
      envBadgeReady: '辅助环境就绪',
      envBadgeInstalling: '辅助环境安装中',
      envBadgeMissing: 'Python 辅助环境未安装',
      envBadgeAttention: 'Python 辅助环境需要处理',
      envStateMissing: 'Python 辅助环境未安装',
      envStateIncomplete: '不完整',
      envStateBroken: '需要重建',
      envStateOutdated: '需要更新',
      envStateReady: '就绪',
      envStateInstalling: '安装中',
      envStateUnavailable: '状态不可用',
      envLoading: '正在读取环境状态…',
      envInstall: '安装辅助环境',
      envRepair: '修复辅助环境',
      envRebuild: '重建',
      envRecheck: '重新检测',
      envInstalling: '安装中',
      envPathLabel: '环境位置',
      envBaseLabel: '底座',
      envPackagesLabel: '已装版本',
      envMissingLabel: '缺少',
      envPlanTitle: '安装内容',
      envPlanSize: '约 {download} MB 下载、{disk} MB 磁盘',
      envLogTitle: '安装日志',
      envLogPathLabel: '日志',
      envCloseHint: '可以关掉这个页面，安装在后台继续。',
      envDirtyHint: '有未保存的环境设置，安装会使用已保存的值。',
      envCommandHint: '也可以在插件目录运行下面的命令：',
      envFallbackTitle: '读不到环境状态',
      envFallbackHint: '当前宿主没有提供设置页通道；请用下面的命令安装。',
      envErrorTitle: '操作失败',
      envBaseUnknown: '未知（安装时连接 Blender，或填写底座路径）',
      envBaseBlender: 'Blender 自带',
      envBaseConfig: '配置指定',
      envBaseSaved: '上次记录',
      envBaseInstalled: '安装时记录',
      envLastFailed: '上次安装失败',
      envInterrupted: '上次安装被中断，请重试。',
      envHelperCount: 'helper {ready}/{total} 个可用',
      envNeedBlender: '需要 Blender 在线，或先填写底座 Python。',
      ariaToggle: '切换 {label}',
      ariaDecrease: '减少 {label}',
      ariaIncrease: '增加 {label}',
      valueOn: '开',
      valueOff: '关',
    }

    /** @type {Record<string, string>} */
    const en = {
      title: 'dsh-blender-mcp-bridge',
      navLabel: 'Blender MCP',
      tagline: 'Let the model work safely in the Blender session you have open',
      heroMeta: 'Saved to the plugin config files under DSH_HOME/dsh-blender-mcp-bridge and applied immediately',
      badgeLive: 'Applies on save',
      badgeCustom: 'Customized',
      factSave: 'The plugin never saves the .blend and never quits Blender; undo with Ctrl+Z.',
      factSnapshot: 'Snapshots run before writes; three are kept by default and can be changed below, beside the .blend.',
      factTimeout: 'Timeouts only limit how long DSH waits. A render keeps running; read it with render_status.',
      sectionConnection: 'Connection and timeouts',
      sectionConnectionHint: 'The local address of the official Blender MCP add-on and the default waits.',
      sectionSnapshot: 'Snapshots and undo',
      sectionSnapshotHint: 'Give long tasks a few safe points; snapshots never change the open project.',
      sectionSafety: 'Safety and audit',
      sectionSafetyHint: 'The guard blocks obvious dangerous calls such as saving, quitting, or changing preferences.',
      sectionTask: 'Task directory',
      sectionTaskHint: 'The plugin writes only inside its task directory; this decides where that directory lives.',
      sectionHelperEnv: 'Python helper environment',
      sectionHelperEnvHint: 'All analysis helpers share this one managed environment. Install it once; it never searches other Pythons on the machine.',
      sectionAdvanced: 'Advanced and helper analysis',
      sectionAdvancedHint: 'Leave these alone unless you are troubleshooting helper timeouts, output caps or maintenance helpers.',
      advancedShow: 'Show advanced settings',
      advancedHide: 'Hide advanced settings',
      fieldHost: 'Host',
      hostHint: 'Local address the Blender MCP add-on listens on; usually 127.0.0.1.',
      fieldPort: 'Port',
      portHint: 'Defaults to 9876 and must match the Blender add-on settings.',
      fieldConnect: 'Connect timeout',
      connectHint: 'Longest wait when opening the local connection, in seconds.',
      fieldResponse: 'Exec timeout',
      responseHint: 'Default wait for ordinary blender_mcp_exec calls, in seconds; one call can override it.',
      fieldCapture: 'Capture timeout',
      captureHint: 'Longest wait for a viewport capture, in seconds.',
      fieldRender: 'Render timeout',
      renderHint: 'Default render wait in seconds; one tool call can wait up to 30 minutes, and the render keeps going after a timeout.',
      fieldSnapshotEnabled: 'Automatic snapshots',
      snapshotEnabledHint: 'Save a copy before writes; a failed snapshot stops the write.',
      fieldGenerations: 'Copies kept',
      generationsHint: 'Keep only the newest snapshots, 1–20; more copies use more disk.',
      fieldSnapshotOn: 'Cadence',
      snapshotOnHint: 'Adaptive: first write, periodic, and before deletes; Turn: one per turn; Write: every write.',
      fieldEveryWrites: 'Write interval',
      everyWritesHint: 'In adaptive mode, take another snapshot after this many writes, 1–100.',
      fieldOnDestructive: 'Before deletes',
      onDestructiveHint: 'Take one more snapshot when the code looks like it deletes data.',
      fieldCompress: 'Compress snapshots',
      compressHint: 'Saves disk on large scenes but makes each copy slower.',
      fieldSnapshotTimeout: 'Snapshot timeout',
      snapshotTimeoutHint: 'Longest wait for one snapshot write, in seconds.',
      fieldGuard: 'Write guard',
      guardHint: 'Blocks calls that would save the file, quit Blender, or change preferences.',
      fieldAudit: 'Audit log',
      auditHint: 'Record each write and its result in the task directory.',
      fieldStoreCode: 'Store full code',
      storeCodeHint: 'Keep the complete Python in the audit log; the default keeps a summary only.',
      fieldTaskRootMode: 'Directory mode',
      taskRootModeHint: 'Beside the .blend: next to the project; Workspace: inside the current workspace.',
      fieldTaskRoot: 'Custom root',
      taskRootHint: 'Used when set; leave empty to follow the mode above.',
      fieldHelperBasePython: 'Base Python',
      helperBasePythonHint: 'Empty uses Blender\'s bundled Python; it is only used when creating the environment.',
      fieldHelperPipIndex: 'pip index',
      helperPipIndexHint: 'Empty uses PyPI; set a company or proxy mirror when needed.',
      fieldHelperTimeout: 'Helper timeout',
      helperTimeoutHint: 'Longest run time for an analysis helper, in seconds.',
      fieldHelperOutput: 'Helper output cap',
      helperOutputHint: 'Characters kept from one helper output.',
      fieldMaintenance: 'Maintenance helpers',
      maintenanceHint: 'Enable install and validation helpers; turn on only while troubleshooting.',
      fieldResponseChars: 'Reply cap',
      responseCharsHint: 'Largest Blender reply allowed, so a huge result cannot fill the context.',
      modeAdaptive: 'Adaptive',
      modeTurn: 'Per turn',
      modeWrite: 'Every write',
      taskModeBlend: 'Beside .blend',
      taskModeWorkspace: 'Workspace',
      unitSeconds: 's',
      unitChars: 'chars',
      save: 'Save settings',
      saving: 'Saving…',
      discard: 'Discard',
      defaults: 'Restore defaults',
      reload: 'Reload',
      changeCount: '{count} pending',
      statusClean: 'No unsaved changes',
      readOnly: 'This configuration is read-only right now.',
      saved: 'Saved. The configuration is live.',
      defaultsLoaded: 'Defaults loaded; save to apply them.',
      loadingTitle: 'Reading plugin configuration…',
      loadingHint: 'From the plugin\'s own config files.',
      unavailableTitle: 'Configuration form unavailable',
      unavailableHint: 'The settings channel is unavailable; edit DSH_HOME/dsh-blender-mcp-bridge/*.json or reload the page.',
      errorRequired: 'Required',
      errorRangeInt: 'Enter an integer from {min} to {max}',
      errorRangeSeconds: 'Enter a value from {min} to {max} seconds',
      errorInvalid: 'Invalid value',
      errorInvalidFields: 'Some fields are empty or out of range.',
      errorSave: 'Save failed: {message}',
      errorConflict: 'The configuration changed elsewhere; reload before saving.',
      errorBoundary: 'This settings section hit a problem; the plugin itself is unaffected.',
      errorBoundaryHint: 'Reload the page, or edit DSH_HOME/dsh-blender-mcp-bridge/*.json directly.',
      customized: 'Customized',
      dirtyField: 'Unsaved change',
      rangeSeconds: 'Range {min}–{max} s',
      rangeMinSeconds: 'At least {min} s',
      rangeInt: 'Range {min}–{max}',
      rangeMinInt: 'At least {min} characters',
      placeholderHost: '127.0.0.1',
      placeholderTaskRoot: 'Empty to choose automatically',
      placeholderBasePython: 'Empty uses Blender\'s bundled Python',
      placeholderPipIndex: 'Empty uses PyPI',
      envBadgeReady: 'Helper env ready',
      envBadgeInstalling: 'Helper env installing',
      envBadgeMissing: 'Python helper env not installed',
      envBadgeAttention: 'Python helper env needs attention',
      envStateMissing: 'Python helper env not installed',
      envStateIncomplete: 'Incomplete',
      envStateBroken: 'Needs rebuild',
      envStateOutdated: 'Needs update',
      envStateReady: 'Ready',
      envStateInstalling: 'Installing',
      envStateUnavailable: 'Status unavailable',
      envLoading: 'Reading the environment status…',
      envInstall: 'Install helper environment',
      envRepair: 'Repair helper environment',
      envRebuild: 'Rebuild',
      envRecheck: 'Recheck',
      envInstalling: 'Installing',
      envPathLabel: 'Location',
      envBaseLabel: 'Base',
      envPackagesLabel: 'Installed',
      envMissingLabel: 'Missing',
      envPlanTitle: 'Will install',
      envPlanSize: 'about {download} MB download, {disk} MB disk',
      envLogTitle: 'Install log',
      envLogPathLabel: 'Log',
      envCloseHint: 'You can close this page; the install continues in the background.',
      envDirtyHint: 'Some environment settings are unsaved; the install uses the saved values.',
      envCommandHint: 'You can also run this command in the plugin directory:',
      envFallbackTitle: 'Environment status is unavailable',
      envFallbackHint: 'This host does not expose the settings channel; use the command below to install.',
      envErrorTitle: 'Action failed',
      envBaseUnknown: 'Unknown (connect Blender at install time, or set a base path)',
      envBaseBlender: 'Blender bundled',
      envBaseConfig: 'Configured',
      envBaseSaved: 'Last seen',
      envBaseInstalled: 'Recorded at install',
      envLastFailed: 'Last install failed',
      envInterrupted: 'Last install was interrupted; try again.',
      envHelperCount: '{ready}/{total} helpers available',
      envNeedBlender: 'Blender must be online, or set a base Python first.',
      ariaToggle: 'Toggle {label}',
      ariaDecrease: 'Decrease {label}',
      ariaIncrease: 'Increase {label}',
      valueOn: 'on',
      valueOff: 'off',
    }

    /**
     * Every editable leaf, in render order. `seconds` values are milliseconds
     * in the profile and rendered as seconds; `min`/`max` use display units.
     */
    const FIELDS = [
      { key: 'host', path: ['host'], kind: 'text', label: 'fieldHost', hint: 'hostHint', group: 'connection', required: true, width: 'host' },
      { key: 'port', path: ['port'], kind: 'int', label: 'fieldPort', hint: 'portHint', min: 1, max: 65535, group: 'connection', display: 'input', width: 'port' },
      { key: 'connectTimeoutMs', path: ['connectTimeoutMs'], kind: 'seconds', label: 'fieldConnect', hint: 'connectHint', min: 0.1, group: 'connection' },
      { key: 'responseTimeoutMs', path: ['responseTimeoutMs'], kind: 'seconds', label: 'fieldResponse', hint: 'responseHint', min: 1, group: 'connection' },
      { key: 'captureTimeoutMs', path: ['captureTimeoutMs'], kind: 'seconds', label: 'fieldCapture', hint: 'captureHint', min: 1, group: 'connection' },
      { key: 'renderTimeoutMs', path: ['renderTimeoutMs'], kind: 'seconds', label: 'fieldRender', hint: 'renderHint', min: 1, group: 'connection' },
      { key: 'snapshotEnabled', path: ['snapshot', 'enabled'], kind: 'bool', label: 'fieldSnapshotEnabled', hint: 'snapshotEnabledHint', group: 'snapshot' },
      { key: 'snapshotGenerations', path: ['snapshot', 'generations'], kind: 'int', label: 'fieldGenerations', hint: 'generationsHint', min: 1, max: 20, group: 'snapshot', display: 'stepper' },
      { key: 'snapshotOn', path: ['snapshot', 'on'], kind: 'enum', label: 'fieldSnapshotOn', hint: 'snapshotOnHint', group: 'snapshot', options: ['adaptive', 'turn', 'write'] },
      { key: 'snapshotEveryWrites', path: ['snapshot', 'everyWrites'], kind: 'int', label: 'fieldEveryWrites', hint: 'everyWritesHint', min: 1, max: 100, group: 'snapshot', display: 'stepper' },
      { key: 'snapshotOnDestructive', path: ['snapshot', 'onDestructive'], kind: 'bool', label: 'fieldOnDestructive', hint: 'onDestructiveHint', group: 'snapshot' },
      { key: 'snapshotCompress', path: ['snapshot', 'compress'], kind: 'bool', label: 'fieldCompress', hint: 'compressHint', group: 'snapshot' },
      { key: 'snapshotTimeoutMs', path: ['snapshot', 'timeoutMs'], kind: 'seconds', label: 'fieldSnapshotTimeout', hint: 'snapshotTimeoutHint', min: 1, group: 'snapshot' },
      { key: 'guardEnabled', path: ['guard', 'enabled'], kind: 'bool', label: 'fieldGuard', hint: 'guardHint', group: 'safety' },
      { key: 'auditEnabled', path: ['audit', 'enabled'], kind: 'bool', label: 'fieldAudit', hint: 'auditHint', group: 'safety' },
      { key: 'auditStoreCode', path: ['audit', 'storeCode'], kind: 'bool', label: 'fieldStoreCode', hint: 'storeCodeHint', group: 'safety', sub: true },
      { key: 'taskRootMode', path: ['taskRootMode'], kind: 'enum', label: 'fieldTaskRootMode', hint: 'taskRootModeHint', group: 'task', options: ['blendFile', 'workspace'] },
      { key: 'taskRoot', path: ['taskRoot'], kind: 'text', label: 'fieldTaskRoot', hint: 'taskRootHint', group: 'task', block: true, placeholder: 'placeholderTaskRoot' },
      { key: 'helperBasePython', path: ['helper', 'basePython'], kind: 'text', label: 'fieldHelperBasePython', hint: 'helperBasePythonHint', group: 'helperEnv', block: true, placeholder: 'placeholderBasePython' },
      { key: 'helperPipIndex', path: ['helper', 'pipIndexUrl'], kind: 'text', label: 'fieldHelperPipIndex', hint: 'helperPipIndexHint', group: 'helperEnv', block: true, placeholder: 'placeholderPipIndex' },
      { key: 'helperTimeoutMs', path: ['helper', 'timeoutMs'], kind: 'seconds', label: 'fieldHelperTimeout', hint: 'helperTimeoutHint', min: 1, group: 'advanced' },
      { key: 'helperMaxOutputChars', path: ['helper', 'maxOutputChars'], kind: 'int', label: 'fieldHelperOutput', hint: 'helperOutputHint', min: 1000, group: 'advanced', display: 'input', width: 'port' },
      { key: 'helperMaintenance', path: ['helper', 'enableMaintenanceHelpers'], kind: 'bool', label: 'fieldMaintenance', hint: 'maintenanceHint', group: 'advanced' },
      { key: 'maxResponseChars', path: ['maxResponseChars'], kind: 'int', label: 'fieldResponseChars', hint: 'responseCharsHint', min: 1000, group: 'advanced', display: 'input', width: 'port' },
    ]

    /** Section order and copy. */
    const GROUPS = [
      { id: 'connection', title: 'sectionConnection', hint: 'sectionConnectionHint', icon: 'link' },
      { id: 'snapshot', title: 'sectionSnapshot', hint: 'sectionSnapshotHint', icon: 'camera' },
      { id: 'safety', title: 'sectionSafety', hint: 'sectionSafetyHint', icon: 'shield' },
      { id: 'task', title: 'sectionTask', hint: 'sectionTaskHint', icon: 'folder' },
      { id: 'helperEnv', title: 'sectionHelperEnv', hint: 'sectionHelperEnvHint', icon: 'spark' },
    ]
    const ADVANCED_GROUP = { id: 'advanced', title: 'sectionAdvanced', hint: 'sectionAdvancedHint', icon: 'spark' }
    const ENUM_LABELS = {
      adaptive: 'modeAdaptive',
      turn: 'modeTurn',
      write: 'modeWrite',
      blendFile: 'taskModeBlend',
      workspace: 'taskModeWorkspace',
    }

    /** @type {string} */
    const CSS = `
.bb-root { position: relative; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; overflow: visible; }
.bb-hero { display: flex; align-items: flex-start; gap: 14px; padding: 22px 22px 18px; border-radius: 15px 15px 0 0; background: linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent), transparent 62%); }
.bb-mark { width: 44px; height: 44px; flex: none; display: grid; place-items: center; border-radius: 14px; border: 1px solid color-mix(in srgb, #EA7A1A 55%, transparent); background: linear-gradient(145deg, #F0922F, #D96A0B); color: #FFF7ED; box-shadow: 0 3px 10px -6px color-mix(in srgb, #EA7A1A 70%, transparent); }
.bb-titles { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.bb-title { margin: 0; font-size: 18px; line-height: 24px; font-weight: 600; letter-spacing: .01em; }
.bb-tagline { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 19px; }
.bb-meta { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 52%, transparent); font-size: 11.5px; line-height: 16px; }
.bb-badges { margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.bb-pill { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font-size: 11px; white-space: nowrap; }
.bb-pill[data-tone="success"] { color: var(--dsw-alias-state-success-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 32%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, transparent); }
.bb-pill[data-tone="brand"] { color: var(--dsw-alias-brand-primary); border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 28%, transparent); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent); }
.bb-pill[data-tone="warn"] { color: var(--dsw-alias-state-warn-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 38%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 9%, transparent); }
.bb-pill[data-tone="error"] { color: var(--dsw-alias-state-error-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 55%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); font-weight: 600; }
.bb-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
.bb-callout { display: flex; flex-direction: column; gap: 7px; margin: 14px 22px 10px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent); border-radius: 12px; background: color-mix(in srgb, var(--dsw-alias-brand-primary) 6%, transparent); }
.bb-fact { display: flex; align-items: flex-start; gap: 8px; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
.bb-fact > svg { flex: none; margin-top: 1px; color: var(--dsw-alias-brand-primary); }
.bb-body { padding: 6px 22px 96px; }
.bb-section { padding: 16px 0 4px; border-top: 1px solid var(--dsw-alias-border-l1); }
.bb-body > .bb-section:first-child { border-top: 0; padding-top: 12px; }
.bb-sectionHead { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 4px; }
.bb-sectionIcon { width: 26px; height: 26px; flex: none; display: grid; place-items: center; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); background: color-mix(in srgb, var(--dsw-alias-label-secondary) 6%, transparent); color: var(--dsw-alias-label-secondary); }
.bb-sectionCopy { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bb-sectionTitle { margin: 0; font-size: 13.5px; font-weight: 600; line-height: 20px; }
.bb-sectionHint { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 66%, transparent); font-size: 12px; line-height: 18px; }
.bb-rows { display: flex; flex-direction: column; padding-left: 36px; }
.bb-row { display: grid; grid-template-columns: minmax(0, 1fr) 200px; align-items: start; gap: 16px; padding: 10px 0; }
.bb-row + .bb-row { border-top: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 62%, transparent); }
.bb-row.bb-sub { margin-left: 36px; padding-left: 14px; border-left: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 82%, transparent); }
.bb-row.bb-block { grid-template-columns: 1fr; gap: 6px; }
.bb-rowLabel { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bb-labelLine { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.bb-label { color: var(--dsw-alias-label-primary); font-size: 13px; font-weight: 500; line-height: 18px; }
.bb-dirtyDot { width: 5px; height: 5px; flex: none; border-radius: 50%; background: var(--dsw-alias-brand-primary); }
.bb-hint { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 66%, transparent); font-size: 12px; line-height: 17px; }
.bb-range { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 58%, transparent); font-size: 11.5px; line-height: 16px; }
.bb-fieldError { color: var(--dsw-alias-state-error-primary); font-size: 11.5px; line-height: 16px; }
.bb-control { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; width: 100%; min-height: 36px; }
.bb-field { display: inline-flex; align-items: center; gap: 6px; height: 36px; width: 100%; min-width: 0; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); transition: border-color .15s ease, box-shadow .15s ease; }
.bb-field:focus-within { border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 55%, var(--dsw-alias-border-l2)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); }
.bb-field input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: inherit; font: inherit; font-size: 13px; padding: 0; }
.bb-field input::placeholder { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 48%, transparent); }
.bb-field input[type="number"] { -moz-appearance: textfield; appearance: textfield; text-align: end; font-variant-numeric: tabular-nums; }
.bb-field input[type="number"]::-webkit-outer-spin-button, .bb-field input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.bb-unit { flex: none; color: color-mix(in srgb, var(--dsw-alias-label-secondary) 55%, transparent); font-size: 11.5px; }
.bb-toggle { position: relative; width: 40px; height: 22px; flex: none; padding: 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: var(--dsw-alias-bg-layer-2); cursor: pointer; transition: background .15s ease, border-color .15s ease; }
.bb-toggle::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--dsw-alias-label-primary); opacity: .52; box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary) 22%, transparent); transition: transform .15s ease, opacity .15s ease, background .15s ease; }
.bb-toggle[aria-checked="true"] { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-brand-primary); }
.bb-toggle[aria-checked="true"]::after { transform: translateX(18px); opacity: 1; background: var(--dsw-alias-bg-base); }
.bb-toggle:disabled { opacity: .5; cursor: default; }
.bb-seg { display: inline-flex; gap: 2px; width: 100%; padding: 3px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 11px; background: var(--dsw-alias-bg-layer-2); }
.bb-seg button { flex: 1 1 0; height: 28px; padding: 0 8px; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12.5px; white-space: nowrap; cursor: pointer; transition: background .12s ease, color .12s ease; }
.bb-seg button:hover:not(:disabled) { color: var(--dsw-alias-label-primary); background: color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent); }
.bb-seg button[aria-checked="true"] { color: var(--dsw-alias-bg-base); background: var(--dsw-alias-label-primary); box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary) 24%, transparent); }
.bb-seg button:disabled { opacity: .5; cursor: default; }
.bb-stepper { display: inline-flex; align-items: center; width: 100%; height: 36px; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); }
.bb-stepper button { width: 32px; height: 100%; border: 0; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 16px; line-height: 1; cursor: pointer; }
.bb-stepper button:hover:not(:disabled) { background: color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent); color: var(--dsw-alias-label-primary); }
.bb-stepper button:disabled { opacity: .35; cursor: default; }
.bb-stepper output { flex: 1; min-width: 0; text-align: center; color: var(--dsw-alias-label-primary); font-size: 13px; font-variant-numeric: tabular-nums; }
.bb-advancedToggle { width: 100%; display: flex; align-items: center; gap: 8px; margin-top: 14px; padding: 14px 0 2px; border: 0; border-top: 1px solid var(--dsw-alias-border-l1); background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.bb-advancedToggle:hover { color: var(--dsw-alias-label-primary); }
.bb-chevron { flex: none; transition: transform .15s ease; }
.bb-advancedToggle[aria-expanded="true"] .bb-chevron { transform: rotate(90deg); }
.bb-advanced { animation: bb-reveal .16s ease-out; }
.bb-envCard { display: flex; flex-direction: column; gap: 10px; margin: 4px 0 12px; padding: 14px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); }
.bb-envHead { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.bb-envDot { width: 8px; height: 8px; flex: none; border-radius: 50%; background: var(--dsw-alias-label-secondary); }
.bb-envCard[data-state="ready"] .bb-envDot { background: var(--dsw-alias-state-success-primary); }
.bb-envCard[data-state="incomplete"] .bb-envDot, .bb-envCard[data-state="broken"] .bb-envDot, .bb-envCard[data-state="outdated"] .bb-envDot { background: var(--dsw-alias-state-warn-primary); }
.bb-envCard[data-state="missing"] { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 48%, var(--dsw-alias-border-l2)); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 6%, var(--dsw-alias-bg-layer-2)); }
.bb-envCard[data-state="missing"] .bb-envDot { background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-error-primary) 16%, transparent); }
.bb-envCard[data-state="missing"] .bb-envState { color: var(--dsw-alias-state-error-primary); }
.bb-envState { font-size: 13px; font-weight: 600; }
.bb-envMeta { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 72%, transparent); font-size: 11.5px; }
.bb-envGrid { display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 4px 10px; font-size: 11.5px; line-height: 17px; }
.bb-envKey { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 66%, transparent); }
.bb-envValue { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }
.bb-envValue code, .bb-envCode { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; }
.bb-envNote { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 72%, transparent); font-size: 12px; line-height: 18px; }
.bb-envLog { margin: 0; max-height: 160px; overflow: auto; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; line-height: 15px; white-space: pre-wrap; overflow-wrap: anywhere; }
.bb-envActions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.bb-envCard[data-tone="error"] { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 38%, transparent); }
.bb-envError { color: var(--dsw-alias-state-error-primary); font-size: 12px; line-height: 18px; overflow-wrap: anywhere; }
.bb-envActions .bb-btn { height: 32px; }
@keyframes bb-reveal { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: translateY(0); } }
.bb-savebar { position: sticky; bottom: 12px; z-index: 3; display: flex; align-items: center; flex-wrap: wrap; justify-content: space-between; gap: 10px 14px; margin: 0 14px 14px; padding: 12px 16px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 14px 34px -18px color-mix(in srgb, var(--dsw-alias-label-primary) 30%, transparent), 0 2px 6px -2px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent); }
.bb-saveMeta { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bb-status { display: flex; align-items: center; gap: 6px; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.bb-status[data-tone="error"] { color: var(--dsw-alias-state-error-primary); }
.bb-status[data-tone="success"] { color: var(--dsw-alias-state-success-primary); }
.bb-actions { display: flex; align-items: center; gap: 8px; flex: none; margin-left: auto; }
.bb-btn { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 9px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12.5px; cursor: pointer; transition: background .12s ease, color .12s ease, border-color .12s ease; }
.bb-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent); color: var(--dsw-alias-label-primary); }
.bb-btn:disabled { opacity: .45; cursor: default; }
.bb-btn.bb-primary { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-bg-base); }
.bb-btn.bb-primary:hover:not(:disabled) { background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-bg-base); filter: brightness(1.05); }
.bb-btn.bb-primary:disabled { opacity: 1; border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); filter: none; }
.bb-skeleton { display: flex; flex-direction: column; gap: 14px; padding: 24px 22px; }
.bb-skelLine { height: 12px; border-radius: 6px; background: var(--dsw-alias-bg-layer-2); animation: bb-pulse 1.6s ease-in-out infinite; }
.bb-skelLine.bb-skelTitle { width: 42%; height: 18px; }
.bb-skelLine.bb-skelLong { width: 78%; }
.bb-skelLine.bb-skelShort { width: 56%; }
@keyframes bb-pulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
.bb-fallback { display: flex; align-items: flex-start; gap: 12px; padding: 22px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; background: var(--dsw-alias-bg-layer-1); }
.bb-fallbackIcon { flex: none; color: var(--dsw-alias-state-warn-primary); }
.bb-fallbackCopy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.bb-fallbackTitle { font-size: 13.5px; font-weight: 600; }
.bb-fallbackHint { color: var(--dsw-alias-label-secondary); font-size: 12.5px; line-height: 18px; }
.bb-fallbackCode { max-width: 100%; overflow-wrap: anywhere; color: color-mix(in srgb, var(--dsw-alias-label-secondary) 62%, transparent); font-size: 11.5px; line-height: 16px; }
.bb-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.bb-root :focus-visible { outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 42%, transparent); outline-offset: 2px; }
.bb-field input:focus-visible { outline: none; }
@media (max-width: 640px) {
  .bb-hero { flex-wrap: wrap; padding: 18px 16px 14px; }
  .bb-badges { width: 100%; margin-left: 0; justify-content: flex-start; }
  .bb-callout { margin: 12px 16px 8px; }
  .bb-body { padding: 4px 16px 116px; }
  .bb-savebar { bottom: 10px; margin: 0 10px 10px; padding: 10px 12px; border-radius: 12px; }
  .bb-actions { width: 100%; justify-content: flex-end; }
  .bb-rows { padding-left: 0; }
  .bb-row { grid-template-columns: 1fr; gap: 8px; }
  .bb-control { justify-content: flex-start; width: 100%; }
  .bb-seg { max-width: 100%; }
  .bb-seg button { flex: 1 1 auto; }
  .bb-row.bb-sub { margin-left: 18px; }
  .bb-envCard { margin-left: 0; }
  .bb-envGrid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .bb-toggle::after, .bb-chevron, .bb-advanced { transition: none; animation: none; }
  .bb-skelLine { animation: none; }
}
`

    /** @param {any} props @returns {any} */
    function SvgIcon({ size = 16, className, children }) {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: size,
          height: size,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
          focusable: 'false',
          className,
        },
        children,
      )
    }

    /** @returns {any} the bridge mark */
    function BrandMark() {
      return h(
        'svg',
        { viewBox: '0 0 32 32', width: 28, height: 28, 'aria-hidden': true },
        h('path', { d: 'M4.5 24V18.5a11.5 11.5 0 0 1 23 0V24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' }),
        h('path', { d: 'M3 24h26', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' }),
        h('path', { d: 'M10.5 24v-5.2M21.5 24v-5.2', fill: 'none', stroke: '#FFD8B0', strokeWidth: 1.8, strokeLinecap: 'round' }),
        h('circle', { cx: 16, cy: 11.6, r: 3.6, fill: '#FFF7ED' }),
      )
    }

    /** @returns {any} */
    function IconLink() {
      return h(SvgIcon, null, h('path', { d: 'M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13' }), h('path', { d: 'M14 11a5 5 0 0 1 0 7l-1.5 1.5a5 5 0 0 1-7-7L7 11' }))
    }
    /** @returns {any} */
    function IconCamera() {
      return h(SvgIcon, null, h('path', { d: 'M4 8h3l1.5-2h7L17 8h3v11H4z' }), h('circle', { cx: 12, cy: 13, r: 3.2 }))
    }
    /** @returns {any} */
    function IconShield() {
      return h(SvgIcon, null, h('path', { d: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z' }), h('path', { d: 'M9.5 12l1.8 1.8 3.6-3.8' }))
    }
    /** @returns {any} */
    function IconFolder() {
      return h(SvgIcon, null, h('path', { d: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }))
    }
    /** @returns {any} */
    function IconSpark() {
      return h(SvgIcon, null, h('path', { d: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z' }), h('path', { d: 'M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z' }))
    }
    /** @returns {any} */
    function IconClock() {
      return h(SvgIcon, null, h('circle', { cx: 12, cy: 12, r: 8 }), h('path', { d: 'M12 7.5V12l3 2' }))
    }
    /** @returns {any} */
    function IconCheck() {
      return h(SvgIcon, null, h('path', { d: 'M5 12.5l4.5 4.5L19 7.5' }))
    }
    /** @returns {any} */
    function IconReset() {
      return h(SvgIcon, null, h('path', { d: 'M4 5v5h5' }), h('path', { d: 'M5.5 10a7 7 0 1 1-1 5' }))
    }
    /** @returns {any} */
    function IconChevron() {
      return h(SvgIcon, { className: 'bb-chevron' }, h('path', { d: 'M9 6l6 6-6 6' }))
    }
    /** @returns {any} */
    function IconAlert() {
      return h(SvgIcon, null, h('path', { d: 'M12 4l9 16H3z' }), h('path', { d: 'M12 9.5v4.5' }), h('path', { d: 'M12 17.2v.1' }))
    }
    /** @returns {any} */
    function IconInfo() {
      return h(SvgIcon, null, h('circle', { cx: 12, cy: 12, r: 8 }), h('path', { d: 'M12 11v5' }), h('path', { d: 'M12 8v.1' }))
    }

    /** @param {any} group @returns {any} */
    function groupIcon(group) {
      if (group.icon === 'link') return h(IconLink)
      if (group.icon === 'camera') return h(IconCamera)
      if (group.icon === 'shield') return h(IconShield)
      if (group.icon === 'folder') return h(IconFolder)
      return h(IconSpark)
    }

    /** @param {any} value @returns {any} */
    function clone(value) {
      return value === undefined ? value : structuredClone(value)
    }

    /** @param {any} object @param {string[]} path @returns {any} */
    function getIn(object, path) {
      let node = object
      for (const key of path) {
        if (node === null || typeof node !== 'object') return undefined
        node = node[key]
      }
      return node
    }

    /** @param {any} draft @param {any} baseline @returns {any[]} changed field definitions */
    function changedFields(draft, baseline) {
      if (draft === null || draft === undefined) return []
      return FIELDS.filter((field) => !Object.is(getIn(draft, field.path), getIn(baseline, field.path)))
    }

    /** @param {any} field @param {any} value @returns {string} '' when valid */
    function validateField(field, value) {
      if (field.kind === 'bool') return typeof value === 'boolean' ? '' : 'invalid'
      if (field.kind === 'enum') return field.options.includes(value) ? '' : 'invalid'
      if (field.kind === 'text') {
        if (typeof value !== 'string') return 'invalid'
        return field.required && value.trim() === '' ? 'required' : ''
      }
      if (field.kind === 'int') {
        if (value === null || value === undefined || value === '') return 'required'
        if (!Number.isInteger(value)) return 'invalid'
        if (field.min !== undefined && value < field.min) return 'range'
        if (field.max !== undefined && value > field.max) return 'range'
        return ''
      }
      if (field.kind === 'seconds') {
        if (value === null || value === undefined || value === '') return 'required'
        if (!Number.isInteger(value)) return 'invalid'
        if (field.min !== undefined && value < field.min * 1000) return 'range'
        if (field.max !== undefined && value > field.max * 1000) return 'range'
        return ''
      }
      return ''
    }

    /** @param {any} draft @returns {Record<string, string>} field key -> code */
    function validateDraft(draft) {
      /** @type {Record<string, string>} */
      const errors = {}
      for (const field of FIELDS) {
        const code = validateField(field, getIn(draft, field.path))
        if (code !== '') errors[field.key] = code
      }
      return errors
    }

    /** @param {number} value @returns {string} */
    function formatNumber(value) {
      return Number.isFinite(value) ? String(Math.round(value * 1000) / 1000) : ''
    }

    /** @param {string} text @returns {number | null} */
    function parseNumber(text) {
      if (text.trim() === '') return null
      const value = Number(text)
      return Number.isFinite(value) ? value : null
    }

    /** @param {any} translate @param {string} value @param {string} fallback @returns {string} */
    function enumLabel(translate, value, fallback) {
      const key = ENUM_LABELS[value]
      return key === undefined ? fallback : translate(key)
    }

    /** @param {any} t @param {any} field @returns {string} */
    function rangeText(t, field) {
      if (field.kind === 'seconds') {
        if (field.max === undefined) return t('rangeMinSeconds', { min: formatNumber(field.min) })
        return t('rangeSeconds', { min: formatNumber(field.min), max: formatNumber(field.max) })
      }
      if (field.kind === 'int') {
        if (field.max === undefined || field.max > 1000000) return t('rangeMinInt', { min: field.min })
        return t('rangeInt', { min: field.min, max: field.max })
      }
      return ''
    }

    /** @param {any} t @param {any} field @param {string} code @returns {string} */
    function errorText(t, field, code) {
      if (code === 'required') return t('errorRequired')
      if (code === 'range') {
        return field.kind === 'seconds'
          ? t('errorRangeSeconds', { min: formatNumber(field.min), max: formatNumber(field.max) })
          : t('errorRangeInt', { min: field.min, max: field.max })
      }
      return t('errorInvalid')
    }

    /** @param {any} props @returns {any} */
    function Toggle({ checked, onChange, label, disabled }) {
      return h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': checked,
        'aria-label': label,
        className: 'bb-toggle',
        disabled,
        onClick: () => onChange(!checked),
      })
    }

    /** @param {any} props @returns {any} */
    function Segmented({ value, options, labels, onChange, label, disabled }) {
      return h(
        'div',
        { className: 'bb-seg', role: 'radiogroup', 'aria-label': label },
        options.map((option) =>
          h(
            'button',
            {
              key: option,
              type: 'button',
              role: 'radio',
              'aria-checked': value === option,
              disabled,
              onClick: () => onChange(option),
            },
            labels(option),
          ),
        ),
      )
    }

    /** @param {any} props @returns {any} */
    function Stepper({ value, min, max, label, decreaseLabel, increaseLabel, onChange, disabled }) {
      const current = typeof value === 'number' ? value : min
      return h(
        'div',
        { className: 'bb-stepper', role: 'group', 'aria-label': label },
        h(
          'button',
          {
            type: 'button',
            'aria-label': decreaseLabel,
            disabled: disabled || current <= min,
            onClick: () => onChange(Math.max(min, current - 1)),
          },
          '−',
        ),
        h('output', { 'aria-live': 'off' }, String(current)),
        h(
          'button',
          {
            type: 'button',
            'aria-label': increaseLabel,
            disabled: disabled || current >= max,
            onClick: () => onChange(Math.min(max, current + 1)),
          },
          '+',
        ),
      )
    }

    /** @param {any} props @returns {any} */
    function NumberBox({ id, value, factor, min, max, unit, placeholder, disabled, onChange, labelledBy }) {
      const external = value === null || value === undefined ? null : value / factor
      const [text, setText] = React.useState(external === null ? '' : formatNumber(external))
      React.useEffect(() => {
        const parsed = parseNumber(text)
        const same = parsed === null ? external === null : external !== null && Math.abs(parsed - external) < 1e-9
        if (!same) setText(external === null ? '' : formatNumber(external))
      }, [external, text])
      return h(
        'label',
        { className: 'bb-field bb-number' },
        h('input', {
          id,
          type: 'number',
          inputMode: 'decimal',
          dir: 'ltr',
          value: text,
          min,
          max,
          placeholder,
          disabled,
          'aria-labelledby': labelledBy,
          onChange: (event) => {
            const next = event.target.value
            setText(next)
            const parsed = parseNumber(next)
            onChange(parsed === null ? null : Math.round(parsed * factor))
          },
        }),
        unit === '' ? null : h('span', { className: 'bb-unit' }, unit),
      )
    }

    /** @param {any} props @returns {any} */
    function TextBox({ id, value, placeholder, widthClass, dir, disabled, onChange, labelledBy }) {
      return h(
        'label',
        { className: `bb-field ${widthClass}` },
        h('input', {
          id,
          type: 'text',
          dir: dir ?? 'ltr',
          value: value ?? '',
          placeholder,
          autoComplete: 'off',
          spellCheck: false,
          disabled,
          'aria-labelledby': labelledBy,
          onChange: (event) => onChange(event.target.value),
        }),
      )
    }

    /** @param {any} props @returns {any} */
    function FieldRow({ t, field, value, saved, base, error, dirty, disabled, onChange }) {
      const baseId = React.useId()
      const labelId = `${baseId}-label`
      const controlId = `${baseId}-control`
      const hint = t(field.hint)
      const range = rangeText(t, field)
      const widthClass = field.width === 'host' ? 'bb-host' : field.width === 'wide' ? 'bb-wide' : field.width === 'port' ? 'bb-port' : ''
      const unit = field.kind === 'seconds' ? t('unitSeconds') : field.kind === 'int' && field.key.includes('Chars') ? t('unitChars') : ''
      const factor = field.kind === 'seconds' ? 1000 : 1

      /** @type {any} */
      let control
      if (field.kind === 'bool') {
        control = h(Toggle, {
          checked: value === true,
          label: t('ariaToggle', { label: t(field.label) }),
          disabled,
          onChange,
        })
      } else if (field.kind === 'enum') {
        control = h(Segmented, {
          value,
          options: field.options,
          labels: (option) => enumLabel(t, option, option),
          onChange,
          label: t(field.label),
          disabled,
        })
      } else if (field.kind === 'text') {
        control = h(TextBox, {
          id: controlId,
          value,
          widthClass,
          placeholder: field.placeholder === undefined ? '' : t(field.placeholder),
          disabled,
          onChange,
          labelledBy: labelId,
        })
      } else if (field.display === 'stepper') {
        control = h(Stepper, {
          value,
          min: field.min ?? 0,
          max: field.max ?? 99,
          label: t(field.label),
          decreaseLabel: t('ariaDecrease', { label: t(field.label) }),
          increaseLabel: t('ariaIncrease', { label: t(field.label) }),
          onChange,
          disabled,
        })
      } else {
        control = h(NumberBox, {
          id: controlId,
          value,
          factor,
          min: field.kind === 'seconds' ? field.min * 1000 / factor : field.min,
          max: field.kind === 'seconds' ? field.max * 1000 / factor : field.max,
          unit,
          placeholder: field.min === undefined ? '' : String(field.min),
          disabled,
          onChange,
          labelledBy: labelId,
        })
      }

      const dirtyDot = dirty ? h('span', { className: 'bb-dirtyDot', title: t('dirtyField'), 'aria-label': t('dirtyField') }) : null
      const isNonDefault = base !== undefined && !Object.is(saved, getIn(base, field.path))
      const badge = isNonDefault ? h('span', { className: 'bb-pill', 'data-tone': 'brand' }, h('span', { className: 'bb-dot' }), t('customized')) : null

      return h(
        'div',
        { className: field.sub ? 'bb-row bb-sub' : field.block ? 'bb-row bb-block' : 'bb-row' },
        h(
          'div',
          { className: 'bb-rowLabel' },
          h('div', { className: 'bb-labelLine' }, h('label', { id: labelId, className: 'bb-label', htmlFor: field.kind === 'text' || field.kind === 'int' || field.kind === 'seconds' ? controlId : undefined }, t(field.label)), dirtyDot, badge),
          h('span', { className: 'bb-hint' }, hint),
          range === '' ? null : h('span', { className: 'bb-range' }, range),
          error === '' ? null : h('span', { className: 'bb-fieldError', role: 'alert' }, errorText(t, field, error)),
        ),
        h('div', { className: 'bb-control' }, control),
      )
    }

    /** @param {any} props @returns {any} */
    function Section({ t, group, children }) {
      return h(
        'section',
        { className: 'bb-section', 'aria-labelledby': `bb-section-${group.id}` },
        h(
          'div',
          { className: 'bb-sectionHead' },
          h('span', { className: 'bb-sectionIcon', 'aria-hidden': true }, groupIcon(group)),
          h(
            'div',
            { className: 'bb-sectionCopy' },
            h('h4', { id: `bb-section-${group.id}`, className: 'bb-sectionTitle' }, t(group.title)),
            h('span', { className: 'bb-sectionHint' }, t(group.hint)),
          ),
        ),
        h('div', { className: 'bb-rows' }, children),
      )
    }

    /** @param {any} props @returns {any} */
    function Loading({ t }) {
      return h(
        'div',
        { className: 'bb-root', 'aria-busy': 'true', 'aria-label': t('loadingTitle') },
        h(
          'div',
          { className: 'bb-skeleton' },
          h('div', { className: 'bb-skelLine bb-skelTitle' }),
          h('div', { className: 'bb-skelLine bb-skelLong' }),
          h('div', { className: 'bb-skelLine bb-skelShort' }),
          h('div', { className: 'bb-skelLine bb-skelLong' }),
          h('div', { className: 'bb-skelLine bb-skelShort' }),
        ),
        h('span', { className: 'bb-sr' }, t('loadingTitle')),
      )
    }

    /** @param {any} props @returns {any} */
    function Unavailable({ t }) {
      return h(
        'div',
        { className: 'bb-fallback', role: 'status' },
        h('span', { className: 'bb-fallbackIcon' }, h(IconInfo)),
        h(
          'div',
          { className: 'bb-fallbackCopy' },
          h('strong', { className: 'bb-fallbackTitle' }, t('unavailableTitle')),
          h('span', { className: 'bb-fallbackHint' }, t('unavailableHint')),
        ),
      )
    }

    /** @param {any} props @returns {any} */
    function Fallback({ t, error }) {
      const message = error instanceof Error ? error.message : String(error ?? '')
      return h(
        'div',
        { className: 'bb-fallback', role: 'alert' },
        h('span', { className: 'bb-fallbackIcon' }, h(IconAlert)),
        h(
          'div',
          { className: 'bb-fallbackCopy' },
          h('strong', { className: 'bb-fallbackTitle' }, t('errorBoundary')),
          h('span', { className: 'bb-fallbackHint' }, t('errorBoundaryHint')),
          message === '' ? null : h('code', { className: 'bb-fallbackCode' }, message),
        ),
      )
    }

    /** @param {any} props @returns {any} */
    class SettingsBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }
      static getDerivedStateFromError(error) {
        return { error }
      }
      render() {
        if (this.state.error !== null) return h(Fallback, { t: this.props.t, error: this.state.error })
        return this.props.children
      }
    }

    /**
     * Config-form adapter over the plugin's own settings files.
     *
     * It mimics the `ctx.configForms` store surface used by SettingsPanel, so
     * the draft/validation/save logic stays unchanged while the source of truth
     * becomes GET/POST /api/blender-bridge/settings.
     *
     * @returns {{ getSnapshot: () => any, subscribe: (listener: () => void) => () => void, mutate: (ops: any[], expectedRevision: string) => Promise<boolean> }} form store
     */
    function createRemoteSettingsForm() {
      let snapshot = { status: 'loading' }
      const listeners = new Set()
      let started = false

      const emit = () => {
        for (const listener of listeners) listener()
      }

      /** @param {any} body @returns {boolean} whether the body was a usable snapshot */
      const applyBody = (body) => {
        if (body === null || typeof body !== 'object' || body.status !== 'ready' || body.value === null) return false
        snapshot = {
          status: 'ready',
          value: body.value,
          base: body.base,
          revision: typeof body.revision === 'string' ? body.revision : '',
          writable: body.writable !== false,
        }
        emit()
        return true
      }

      const refresh = async () => {
        try {
          const response = await fetch(SETTINGS_ENDPOINT, { credentials: 'same-origin', cache: 'no-store' })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const body = await response.json()
          if (!applyBody(body)) throw new Error('invalid settings response')
        } catch {
          snapshot = { status: 'unavailable' }
          emit()
        }
      }

      const start = () => {
        if (started && snapshot.status !== 'unavailable') return
        started = true
        if (snapshot.status === 'unavailable') snapshot = { status: 'loading' }
        void refresh()
      }

      return {
        getSnapshot: () => snapshot,
        subscribe: (listener) => {
          listeners.add(listener)
          start()
          return () => {
            listeners.delete(listener)
          }
        },
        mutate: async (ops, expectedRevision) => {
          const response = await fetch(SETTINGS_ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ops, expectedRevision }),
          })
          /** @type {any} */
          let body = null
          try {
            body = await response.json()
          } catch {
            body = null
          }
          if (response.status === 409) {
            applyBody(body)
            return false
          }
          if (!response.ok) {
            const message = body && body.error && body.error.message ? String(body.error.message) : `HTTP ${response.status}`
            throw new Error(message)
          }
          if (!applyBody(body)) throw new Error('invalid settings response')
          return true
        },
      }
    }

    /**
     * Read and poll the managed helper environment status.
     *
     * @returns {{ env: any, error: string, busy: boolean, install: (action: string) => Promise<void>, recheck: () => void }} status and actions
     */
    function useHelperEnvStatus() {
      const [env, setEnv] = React.useState(null)
      const [error, setError] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const alive = React.useRef(true)

      const load = React.useCallback(async (refresh) => {
        try {
          const response = await fetch(`${ENV_ENDPOINT}${refresh ? '?refresh=1' : ''}`, {
            credentials: 'same-origin',
            cache: 'no-store',
          })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const value = await response.json()
          if (!alive.current) return
          setEnv(value)
          setError('')
        } catch (failure) {
          if (!alive.current) return
          setError(failure instanceof Error ? failure.message : String(failure))
        }
      }, [])

      React.useEffect(() => {
        alive.current = true
        void load(false)
        return () => {
          alive.current = false
        }
      }, [load])

      const running = env !== null && env.install !== undefined && env.install.state === 'running'
      React.useEffect(() => {
        if (!running) return undefined
        const timer = window.setInterval(() => {
          void load(false)
        }, 2000)
        return () => window.clearInterval(timer)
      }, [running, load])

      const install = React.useCallback(
        async (action) => {
          setBusy(true)
          setError('')
          try {
            const response = await fetch(ENV_ENDPOINT, {
              method: 'POST',
              credentials: 'same-origin',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ action }),
            })
            const value = await response.json().catch(() => null)
            if (!response.ok) {
              const message = value && value.error && value.error.message ? String(value.error.message) : `HTTP ${response.status}`
              throw new Error(message)
            }
            await load(false)
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          } finally {
            setBusy(false)
          }
        },
        [load],
      )

      const recheck = React.useCallback(() => {
        void load(true)
      }, [load])

      return { env, error, busy, install, recheck }
    }

    /** @param {string} state @returns {string} locale key */
    function envStateKey(state) {
      if (state === 'missing') return 'envStateMissing'
      if (state === 'incomplete') return 'envStateIncomplete'
      if (state === 'broken') return 'envStateBroken'
      if (state === 'outdated') return 'envStateOutdated'
      if (state === 'ready') return 'envStateReady'
      return 'envStateUnavailable'
    }

    /** @param {string} source @returns {string} locale key */
    function envBaseSourceKey(source) {
      if (source === 'blender') return 'envBaseBlender'
      if (source === 'config') return 'envBaseConfig'
      if (source === 'saved') return 'envBaseSaved'
      if (source === 'installed') return 'envBaseInstalled'
      return 'envBaseUnknown'
    }

    /** @param {any} props @returns {any} */
    function HelperEnvCard({ t, env, error, busy, install, recheck, dirtyConfig }) {
      if (env === null) {
        if (error !== '') {
          return h(
            'div',
            { className: 'bb-envCard', 'data-tone': 'error' },
            h('div', { className: 'bb-envHead' }, h('span', { className: 'bb-envDot' }), h('strong', { className: 'bb-envState' }, t('envFallbackTitle'))),
            h('div', { className: 'bb-envNote' }, t('envFallbackHint')),
            h('code', { className: 'bb-envCode' }, 'node scripts/setupAnalysis.js'),
            h('div', { className: 'bb-envError' }, `${t('envErrorTitle')}: ${error}`),
          )
        }
        return h('div', { className: 'bb-envCard' }, h('div', { className: 'bb-envNote' }, t('envLoading')))
      }

      const state = typeof env.state === 'string' ? env.state : 'missing'
      const installState = env.install && typeof env.install.state === 'string' ? env.install.state : 'idle'
      const running = installState === 'running'
      const base = env.base !== null && typeof env.base === 'object' ? env.base : {}
      const missing = Array.isArray(env.missing) ? env.missing : []
      const packages = env.packages !== null && typeof env.packages === 'object' ? env.packages : {}
      const planPackages =
        env.requirements && env.requirements.packages && typeof env.requirements.packages === 'object'
          ? Object.entries(env.requirements.packages)
              .map(([name, version]) => `${name} ${String(version)}`)
              .join(', ')
          : ''
      const downloadMb = Math.round(Number(env.estimates?.downloadBytes ?? 0) / 1e6)
      const diskMb = Math.round(Number(env.estimates?.diskBytes ?? 0) / 1e6)
      const baseText =
        base.valid === true
          ? `${String(base.python)} · Python ${String(base.version)}${base.blenderVersion ? ` · Blender ${String(base.blenderVersion)}` : ''} · ${t(envBaseSourceKey(String(base.source)))}`
          : t('envBaseUnknown')
      const packageText = PACKAGE_ORDER.map((name) => `${name} ${typeof packages[name] === 'string' ? packages[name] : '—'}`).join(', ')
      const primaryKey = state === 'broken' ? 'envRebuild' : state === 'ready' ? '' : state === 'incomplete' || state === 'outdated' ? 'envRepair' : 'envInstall'

      return h(
        'div',
        { className: 'bb-envCard', 'data-state': state, 'data-tone': installState === 'failed' ? 'error' : undefined },
        h(
          'div',
          { className: 'bb-envHead' },
          h('span', { className: 'bb-envDot' }),
          h('strong', { className: 'bb-envState' }, t(running ? 'envStateInstalling' : envStateKey(state))),
          env.helpers
            ? h('span', { className: 'bb-envMeta' }, t('envHelperCount', { ready: env.helpers.ready, total: env.helpers.total }))
            : null,
          running && env.install.phase
            ? h('span', { className: 'bb-envMeta' }, `${String(env.install.phase)} · ${Math.round(Number(env.install.elapsedMs ?? 0) / 1000)}s`)
            : null,
        ),
        h(
          'div',
          { className: 'bb-envGrid' },
          h('span', { className: 'bb-envKey' }, t('envPathLabel')),
          h('span', { className: 'bb-envValue' }, h('code', null, String(env.venvPath ?? ''))),
          h('span', { className: 'bb-envKey' }, t('envBaseLabel')),
          h('span', { className: 'bb-envValue' }, baseText),
          h('span', { className: 'bb-envKey' }, t('envPackagesLabel')),
          h('span', { className: 'bb-envValue' }, packageText),
          missing.length > 0 ? h('span', { className: 'bb-envKey' }, t('envMissingLabel')) : null,
          missing.length > 0 ? h('span', { className: 'bb-envValue' }, missing.join(', ')) : null,
        ),
        env.usable !== true && !running
          ? h(
              'div',
              { className: 'bb-envNote' },
              `${t('envPlanTitle')}: ${planPackages || '—'} · ${t('envPlanSize', { download: downloadMb, disk: diskMb })}`,
              h('div', null, t('envCommandHint')),
              h('code', { className: 'bb-envCode' }, String(env.hints?.installCommand ?? '')),
            )
          : null,
        installState === 'failed' && env.install.error
          ? h('div', { className: 'bb-envError' }, `${t('envLastFailed')}: ${String(env.install.error.message)}`)
          : null,
        installState === 'interrupted' ? h('div', { className: 'bb-envError' }, t('envInterrupted')) : null,
        error !== '' ? h('div', { className: 'bb-envError' }, `${t('envErrorTitle')}: ${error}`) : null,
        running ? h('pre', { className: 'bb-envLog' }, (Array.isArray(env.install.logTail) ? env.install.logTail : []).join('\n')) : null,
        running ? h('div', { className: 'bb-envNote' }, t('envCloseHint')) : null,
        h(
          'div',
          { className: 'bb-envActions' },
          primaryKey !== '' && !running
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'bb-btn bb-primary',
                  disabled: busy,
                  onClick: () => {
                    void install(state === 'broken' ? 'rebuild' : 'install')
                  },
                },
                t(primaryKey),
              )
            : null,
          state !== 'missing' && state !== 'broken' && !running
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'bb-btn',
                  disabled: busy,
                  onClick: () => {
                    void install('rebuild')
                  },
                },
                t('envRebuild'),
              )
            : null,
          h(
            'button',
            { type: 'button', className: 'bb-btn', disabled: busy || running, onClick: recheck },
            t('envRecheck'),
          ),
          dirtyConfig && !running ? h('span', { className: 'bb-envMeta' }, t('envDirtyHint')) : null,
          !running && env.usable !== true && base.valid !== true ? h('span', { className: 'bb-envMeta' }, t('envNeedBlender')) : null,
        ),
      )
    }

    /** @param {any} props @returns {any} */
    function SettingsPanel({ t, locale }) {
      const form = React.useMemo(() => createRemoteSettingsForm(), [])
      const subscribe = React.useCallback((listener) => form.subscribe(listener), [form])
      const getSnapshot = React.useCallback(() => form.getSnapshot(), [form])
      const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
      /** @type {[any, Function]} */
      const [draft, setDraft] = React.useState(null)
      /** @type {[number | null, Function]} */
      const [baseRevision, setBaseRevision] = React.useState(null)
      const [advancedOpen, setAdvancedOpen] = React.useState(false)
      const [saving, setSaving] = React.useState(false)
      const [notice, setNotice] = React.useState('')
      const [error, setError] = React.useState('')
      /** Locale revisions are not rendered; they only force a fresh translation. */
      const [, setLocaleRevision] = React.useState(0)
      const envStatus = useHelperEnvStatus()

      const ready = snapshot.status === 'ready' && snapshot.value !== undefined && snapshot.value !== null
      const current = draft !== null ? draft : snapshot.value

      React.useEffect(() => {
        if (!ready) return
        if (draft === null) {
          setDraft(clone(snapshot.value))
          setBaseRevision(snapshot.revision ?? null)
          return
        }
        const changes = changedFields(draft, snapshot.value)
        if (changes.length === 0 && baseRevision !== snapshot.revision) {
          setDraft(clone(snapshot.value))
          setBaseRevision(snapshot.revision ?? null)
          setError('')
          setNotice('')
        }
      }, [snapshot, draft, baseRevision, ready])

      React.useEffect(() => {
        if (notice === '') return undefined
        const timer = window.setTimeout(() => setNotice(''), 3200)
        return () => window.clearTimeout(timer)
      }, [notice])

      React.useEffect(() => {
        if (locale === undefined || typeof locale.subscribe !== 'function') return undefined
        return locale.subscribe(() => setLocaleRevision((revision) => revision + 1))
      }, [locale])

      if (snapshot.status === 'unavailable') return h(Unavailable, { t })
      if (!ready) return h(Loading, { t })

      const changes = draft !== null ? changedFields(draft, snapshot.value) : []
      const changedKeys = new Set(changes.map((field) => field.key))
      const invalid = validateDraft(current)
      const invalidKeys = Object.keys(invalid)
      const stale = draft !== null && baseRevision !== null && snapshot.revision !== baseRevision && changes.length > 0
      const nonDefault = snapshot.base !== undefined && FIELDS.some((field) => !Object.is(getIn(snapshot.value, field.path), getIn(snapshot.base, field.path)))
      const disabled = !snapshot.writable
      const canSave = snapshot.writable && draft !== null && changes.length > 0 && invalidKeys.length === 0 && !saving && !stale

      /** @param {any} field @param {any} value @returns {void} */
      const update = (field, value) => {
        setNotice('')
        setError('')
        setDraft((previous) => {
          const next = clone(previous === null ? snapshot.value : previous)
          let node = next
          for (const key of field.path.slice(0, -1)) {
            if (node[key] === null || typeof node[key] !== 'object') node[key] = {}
            node = node[key]
          }
          node[field.path[field.path.length - 1]] = value
          return next
        })
      }

      /** @returns {void} */
      const discard = () => {
        setDraft(clone(snapshot.value))
        setBaseRevision(snapshot.revision ?? null)
        setError('')
        setNotice('')
      }

      /** @returns {void} */
      const restoreDefaults = () => {
        if (snapshot.base === undefined) return
        setDraft(clone(snapshot.base))
        setBaseRevision(snapshot.revision ?? null)
        setError('')
        setNotice(t('defaultsLoaded'))
      }

      /** @returns {Promise<void>} */
      const save = async () => {
        if (!canSave) {
          if (stale) setError(t('errorConflict'))
          if (invalidKeys.length > 0) setError(t('errorInvalidFields'))
          return
        }
        const latest = form.getSnapshot()
        if (latest.status !== 'ready' || !latest.writable || latest.value === undefined || latest.value === null) return
        if (baseRevision !== null && latest.revision !== baseRevision) {
          setError(t('errorConflict'))
          return
        }
        const ops = changedFields(draft, latest.value).map((field) => ({
          op: 'set',
          path: field.path,
          value: getIn(draft, field.path),
        }))
        if (ops.length === 0) return
        setSaving(true)
        setError('')
        setNotice('')
        try {
          const accepted = await form.mutate(ops, latest.revision)
          if (!accepted) {
            setError(t('errorConflict'))
            return
          }
          setNotice(t('saved'))
        } catch (failure) {
          setError(t('errorSave', { message: failure instanceof Error ? failure.message : String(failure) }))
        } finally {
          setSaving(false)
        }
      }

      /** @param {any} group @param {boolean} isAdvanced @returns {any} */
      const renderGroup = (group, isAdvanced) => {
        const rows = FIELDS.filter((field) => field.group === group.id).map((field) => {
          const value = getIn(current, field.path)
          return h(FieldRow, {
            key: field.key,
            t,
            field,
            value,
            saved: getIn(snapshot.value, field.path),
            base: snapshot.base,
            error: invalid[field.key] ?? '',
            dirty: changedKeys.has(field.key),
            disabled,
            onChange: (next) => update(field, next),
          })
        })
        if (!isAdvanced && group.id === 'helperEnv') {
          rows.unshift(
            h(HelperEnvCard, {
              key: 'helperEnvCard',
              t,
              env: envStatus.env,
              error: envStatus.error,
              busy: envStatus.busy,
              install: envStatus.install,
              recheck: envStatus.recheck,
              dirtyConfig: changedKeys.has('helperBasePython') || changedKeys.has('helperPipIndex'),
            }),
          )
        }
        return h(Section, { key: group.id, t, group }, rows)
      }

      const facts = [
        { key: 'save', icon: 'shield', text: t('factSave') },
        { key: 'snapshot', icon: 'camera', text: t('factSnapshot') },
        { key: 'timeout', icon: 'clock', text: t('factTimeout') },
      ]

      const envBadge =
        envStatus.env === null
          ? null
          : (() => {
              const installState = envStatus.env.install && envStatus.env.install.state
              const state = envStatus.env.state
              const ready = state === 'ready'
              const missing = state === 'missing'
              const key =
                installState === 'running'
                  ? 'envBadgeInstalling'
                  : ready
                    ? 'envBadgeReady'
                    : missing
                      ? 'envBadgeMissing'
                      : 'envBadgeAttention'
              const tone = installState === 'running' ? 'brand' : ready ? 'success' : missing ? 'error' : 'warn'
              return h('span', { className: 'bb-pill', 'data-tone': tone }, h('span', { className: 'bb-dot' }), t(key))
            })()

      // Keep the setup card in front until the environment is actually ready:
      // a first install, an in-flight install, an update and a rebuild all
      // need the card's controls, so only `ready` returns it to its normal slot.
      const envReady =
        envStatus.env !== null &&
        envStatus.env.state === 'ready' &&
        (!envStatus.env.install || envStatus.env.install.state !== 'running')
      const envPinned = envStatus.env !== null && !envReady
      const orderedGroups = envPinned
        ? [...GROUPS.filter((group) => group.id === 'helperEnv'), ...GROUPS.filter((group) => group.id !== 'helperEnv')]
        : GROUPS

      const advancedToggle = h(
        'button',
        {
          type: 'button',
          className: 'bb-advancedToggle',
          'aria-expanded': advancedOpen,
          onClick: () => setAdvancedOpen((open) => !open),
        },
        h(IconChevron),
        advancedOpen ? t('advancedHide') : t('advancedShow'),
      )

      const status = error !== ''
        ? h('span', { className: 'bb-status', 'data-tone': 'error', role: 'alert' }, h(IconAlert, { size: 14 }), error)
        : stale
          ? h('span', { className: 'bb-status', 'data-tone': 'error', role: 'alert' }, h(IconAlert, { size: 14 }), t('errorConflict'))
          : invalidKeys.length > 0 && changes.length > 0
            ? h('span', { className: 'bb-status', 'data-tone': 'error', role: 'status' }, h(IconAlert, { size: 14 }), t('errorInvalidFields'))
            : notice !== ''
              ? h('span', { className: 'bb-status', 'data-tone': 'success', role: 'status' }, h(IconCheck, { size: 14 }), notice)
              : h(
                  'span',
                  { className: 'bb-status' },
                  disabled ? t('readOnly') : changes.length > 0 ? t('changeCount', { count: changes.length }) : t('statusClean'),
                )

      return h(
        'div',
        { className: 'bb-root' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'bb-hero' },
          h('span', { className: 'bb-mark', 'aria-hidden': true }, h(BrandMark)),
          h(
            'div',
            { className: 'bb-titles' },
            h('h3', { className: 'bb-title' }, t('title')),
            h('p', { className: 'bb-tagline' }, t('tagline')),
            h('span', { className: 'bb-meta' }, t('heroMeta')),
          ),
          h(
            'div',
            { className: 'bb-badges' },
            h('span', { className: 'bb-pill', 'data-tone': 'success' }, h('span', { className: 'bb-dot' }), t('badgeLive')),
            envBadge,
            nonDefault ? h('span', { className: 'bb-pill' }, t('badgeCustom')) : null,
          ),
        ),
        h(
          'div',
          { className: 'bb-callout' },
          facts.map((fact) =>
            h(
              'div',
              { key: fact.key, className: 'bb-fact' },
              fact.icon === 'shield' ? h(IconShield) : fact.icon === 'camera' ? h(IconCamera) : h(IconClock),
              h('span', null, fact.text),
            ),
          ),
        ),
        h(
          'div',
          { className: 'bb-body' },
          orderedGroups.map((group) => renderGroup(group, false)),
          advancedToggle,
          advancedOpen ? h('div', { className: 'bb-advanced' }, renderGroup(ADVANCED_GROUP, true)) : null,
        ),
        h(
          'div',
          { className: 'bb-savebar' },
          h(
            'div',
            { className: 'bb-saveMeta' },
            status,
          ),
          h(
            'div',
            { className: 'bb-actions' },
            stale
              ? h('button', { type: 'button', className: 'bb-btn', onClick: discard }, h(IconReset), t('reload'))
              : null,
            h('button', { type: 'button', className: 'bb-btn', disabled: disabled || changes.length === 0, onClick: discard }, t('discard')),
            h('button', { type: 'button', className: 'bb-btn', disabled: disabled || snapshot.base === undefined, onClick: restoreDefaults }, t('defaults')),
            h(
              'button',
              {
                type: 'button',
                className: 'bb-btn bb-primary',
                disabled: !canSave,
                'aria-busy': saving,
                onClick: save,
              },
              saving ? t('saving') : t('save'),
            ),
          ),
        ),
      )
    }

    /**
     * Register the settings dictionary and the Settings-panel page.
     *
     * @param {any} ctx - browser plugin context
     * @returns {void}
     */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'blender-bridge: settings dictionary')
      const t = ctx.locale.bind(NS)
      ctx.effect(
        () =>
          ctx.slots.inject('settings.section', () =>
            ctx.slots.register(
              {
                name: 'settings.section',
                id: 'blenderBridge',
                order: 55,
                label: () => t('navLabel'),
              },
              (props) => {
                return h(SettingsBoundary, { t }, h(SettingsPanel, { ...props, t, locale: ctx.locale }))
              },
            ),
          ),
        'blender-bridge: settings page',
      )
    }

    return { inject: ['slots', 'locale'], apply }
  },
})
