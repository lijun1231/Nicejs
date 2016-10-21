 | author:Jason Lee(lijun)
 | h5pro：all applications
 | Nice：SPA frame of Nice and some other plugins and tools
 | Node：nodejs for interfaces and other application scenarios


关于由Junb-1.2.3.js分拆至Nice-1.0.0js和Nice.lib-1.0.0.js的说明
 * 分离为Junb.js分离为Nice-1.0.0js和Nice.lib-1.0.0.js，不再向上兼容
 * Nice释义：non-forcible(非强制性) ingenious(灵巧) conpatible(兼容并包) efficient(高效)
 * 二者完全独立，Nice.lib要求：满足AMD规范、原生，文件按功能区进行划分：原生函数拓展、表单区 Nice.Form（表单相关,如验证等）、UI区 Nice.UI（UI层）、
 * 应该允许合并views，可以将页面在index.html中定义页面，而非必须进行load加载因为某些小而精的页面不需要这样做，浪费dns
 * 应该优化hook，至于怎么优化，后续再定
 * 组件的加载和定义必须优化
 * 增加console.warn方便调试
 * 默认使用_作为代理关键字，但是允许设置其他关键字来代理，按时一旦Nice被占用，则直接报错
 * 更加规范，Nice和Nice.lib要符合AMD规范和js strict规范
