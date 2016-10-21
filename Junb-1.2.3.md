 Junb-1.2.3.js
 * 1、对extend进行重新整理，增加init、beforeShow、afterShow、beforeHide、afterHide、unload等钩子函数
 * 2、将公用渲染扩展方式改成以下方式，包括：
 * (1) extendBeforeRender，生成j_m.beforeRender函数：渲染之前，在preFn之前，即使sync为false，都需要执行
 * (2) extendBeforeShow，添加j_m.preFn数组项：拓展公共渲染函数——显示前
 * (3) extendAfterShow，添加j_m.exFn数组项：拓展公共渲染函数——显示后
 * 3、钩子函数执行顺序和解释：
 * 如loaded为false则执行init=>currPage.beforeShow=>currPage[0]添加on=>j_m.beforeRender=>【若sync为true，则执行j_m.preFn=>currPage.afterShow和currPage.hook=>j_m.exFn，oldCurrPage.beforeHide=>移除on】=>清理超量页面并执行被清理的页面的unload，然后remove掉
 * 渲染的概念：self.sync为true时，则进行渲染，否则不渲染，渲染包括：preFn、pFn.afterShow、exFn。渲染之前有：init、beforeShow
 * sync的概念：是否进行渲染
 * 渲染和old页面的(beforeHide与=>afterHide)无先后顺序之分，是并行的
 * 关于beforeRender和preFn的关系：两者都是在preFn之前，前者无论sync是否为true都需要执行，后者则是渲染步骤的第一步，只有sync为true的时候在执行
