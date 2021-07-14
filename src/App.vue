<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  height: 100vh;
}
* {
  padding: 0;
  margin: 0;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

* {
  padding: 0;
  margin: 0;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

body,
html {
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
}

html,
body {
  border: 0;
  font-family: "PingFang-SC-Regular", "Helvetica-Neue", "Helvetica", Arial,
    sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
  font-size: 0.13rem;
  height: 100vh;
  overflow: hidden;
}

div,
span,
object,
iframe,
img,
table,
caption,
thead,
tbody,
tfoot,
tr,
tr,
td,
article,
aside,
canvas,
details,
figure,
hgroup,
menu,
nav,
footer,
header,
section,
summary,
mark,
audio,
video {
  border: 0;
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
address,
cit,
code,
del,
dfn,
em,
ins,
q,
samp,
small,
strong,
sub,
sup,
b,
i,
hr,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
legend,
label {
  border: 0;
  vertical-align: baseline;
  margin: 0;
  padding: 0;
}

article,
aside,
canvas,
figure,
figure img,
figcaption,
hgroup,
footer,
header,
nav,
section,
audio,
video {
  display: block;
}

table {
  border-collapse: separate;
  border-spacing: 0;
}
.table > caption {
  text-align: left;
  vertical-align: middle;
}
.table > th {
  text-align: left;
  vertical-align: middle;
}
.table > td {
  text-align: left;
  vertical-align: middle;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
  /* outline: 0 none; */
}

/* a img {
  border: 0;
} */

/* :focus {
  outline: 0;
} */

* {
  box-sizing: border-box;
}

/* textarea {
  resize: none;
  appearance: none;
} */

.alert-content :global(input) {
  border: 1px solid #dfdfdf;
  padding: 0px 0;
  background: #fff;
  border-radius: 3px;
  padding-left: 5px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.alert-content :global(input:focus) {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}

.alert-content :global(select) {
  margin-top: 5px;
  height: 23px;
  width: 132px;
  border: 1px solid #dfdfdf;
  background-color: #fff;
}

i {
  font-style: normal;
}

/* // 设置浏览器滚动条不可见 */

/* 	::-webkit-scrollbar {
		width: 0;
	}
 */
/* .clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.clearfix {
  zoom: 1;
} */
.el-table__body-wrapper .is-scrolling-none {
  height: auto !important;
}
.el-table::before {
  height: 0px !important;
}
</style>
