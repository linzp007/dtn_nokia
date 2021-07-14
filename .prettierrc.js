// prettier.config.js or .prettierrc.js
module.exports = {
    printWidth: 300,
    tabWidth: 4,
    semi: false,                //代码结尾的分号
    useTabs: false,
    singleQuote: true,      //单引号替代双引号
    trailingComma: 'none',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: "avoid",
    htmlWhitespaceSensitivity: 'css',   // 根据显示样式决定 html 要不要折行
    //eslintIntegration: true,  //让prettier使用eslint的代码格式进行校验
}
