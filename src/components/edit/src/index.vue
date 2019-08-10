<template>
  <div class="tinymce-editor">
    <tinymceVue
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
      @onSelectionChange="handlerFunction"
      v-on="$listeners"
      v-bind="$attrs"
    ></tinymceVue>
  </div>
</template>

<script>
/*
插件说明plugins:
lists  列表插件允许您添加编号和项目符号列表到TinyMCE。要启用高级列表(例如alpha编号列表、方框)，还应该启用高级列表(advlist)插件。
advlist  advlist插件通过向控件添加CSS列表样式类型样式的数字格式和项目符号类型，扩展了核心的bullist和numlist工具栏控件。
image 这个插件允许用户将图片插入TinyMCE的可编辑区域。插件还在插入菜单下添加了一个工具栏按钮和一个插入/编辑图像菜单项。
imagetools Image Tools (imagetools)插件向编辑器中的图像添加上下文编辑工具栏。
media 媒体插件增加了用户向可编辑区域添加HTML5视频和音频元素的能力。它还在“插入”菜单和工具栏按钮下添加了“插入/编辑视频”项。
table  table插件将表管理功能添加到TinyMCE。它还添加了一个新的菜单栏项表，在其下拉列表中包含各种选项，包括Insert表和修改单元格、行和列的选项，以及具有相同功能的工具栏按钮。
bbcode  这个插件可以通过将类似[b]的标签转换为<strong>，然后当用户提交内容时返回，从而以所见即所见的方式编辑BBCode。
anchor 此插件向工具栏添加锚/书签按钮，该按钮在编辑器的光标插入点插入锚。它还在Insert菜单下添加菜单项锚。
autolink 当用户输入一个有效的、完整的URL时，Autolink插件会自动创建超链接。
autoresize 这个插件会自动调整编辑器的大小以适应其中的内容。它通常用于防止编辑器在用户键入可编辑区域时无限扩展
code 这个插件添加了一个工具栏按钮，允许用户编辑WYSIWYG视图隐藏的HTML代码。它还在Tools菜单下添加菜单项源代码。 
codesample 代码示例插件(codesample)允许用户在可编辑区域中插入和嵌入语法颜色突出显示的代码片段。它还在工具栏上添加了一个按钮，单击该按钮将打开一个对话框以接受原始代码输入。
paste 这个插件将过滤/清除粘贴自Microsoft Word的内容。这个插件的强大之处在于它的选项，所以请花点时间在下面了解更多关于它们的信息。
nonbreaking 这个插件添加了一个按钮，用于插入不间断的空间实体在当前插入符号位置(光标插入点)。它还在Insert菜单下拉列表和工具栏按钮下添加了一个菜单项nonbreakspace。
insertdatetime insertdatetime插件提供了工具栏控件和菜单项Insert date/time(在Insert菜单下)，用户可以轻松地将当前日期和/或时间插入光标插入点的可编辑区域。
fullscreen 这个插件为TinyMCE添加了全屏编辑功能。当工具栏按钮被按下时，可编辑区域将填充浏览器的视窗。该插件在视图菜单下添加了一个工具栏按钮和一个全屏菜单项。
searchreplace 这个插件将搜索/替换对话框添加到TinyMCE。它还添加了一个工具栏按钮和“查找和替换”菜单项。
pagebreak 这个插件添加了分页符支持，使用户能够在可编辑区域中插入分页符。当CMS使用特殊的分隔符将内容分成页面时，这非常有用。
hr 
preview 这个插件在工具栏上添加了一个预览按钮。按下此按钮将打开一个对话框，在预览模式下显示当前内容。它还在文件和视图菜单下拉列表下添加了一个菜单项预览。
print 这个插件向工具栏添加了一个打印按钮。它还向文件菜单下拉菜单添加了一个打印项。
autosave 如果用户对编辑器实例中的内容进行了修改，但没有提交修改，这个插件将向用户发出警告。它还在文件菜单下添加了一个菜单项“恢复最后的草稿”。它还向工具栏添加了一个可选按钮，如果您不打算使用菜单，这将非常有用。
charmap 这个插件向编辑器添加了一个带有特殊unicode字符映射的对话框，这些字符不能直接从键盘添加。对话框可以通过工具栏按钮(charmap)或作为插入>特殊字符添加的专用菜单项来调用。
directionality  这个插件向工具栏添加了方向性控件，使TinyMCE能够更好地处理从右向左编写的语言。它还为每个值添加了一个工具栏按钮，ltr表示从左到右的文本，rtl表示从右到左的文本。
fullpage  此插件允许用户编辑某些元数据和文档属性，如标题、关键字和描述。这是通过按下添加到工具栏的控件后出现的对话框来完成的。如果启用了代码插件，fullpage将在源代码视图中公开<head>、<body>和各种元标记。
legacyoutput legacyoutput插件更改TinyMCE的输出，生成遗留元素，如font、b、i、u、strike和use align属性。
link link插件允许用户将外部资源(如网站url)链接到文档中选定的文本。
noneditable 此插件允许您阻止用户编辑分配给mceNonEditable类的元素中的内容。
quickbars Quick Toolbar插件(quickbar)启用新的用户界面组件，帮助用户更快地创建内容。它可以用来创建类似于Medium、Quip和其他现代编辑工具的体验。
spellchecker 这个插件支持TinyMCE的拼写检查功能。它还在工具菜单下拉菜单下添加了一个工具栏按钮和菜单项拼写检查。
tabfocus 这个插件增加了tab in/out TinyMCE的可能性。
textpattern 文本模式插件匹配文本中的特殊模式，并对这些模式应用格式、替换文本或执行命令。
visualblocks 这个插件允许用户查看可编辑区域中的块级元素。它类似于所见即所得的隐藏字符功能，但在块级别。它还在视图菜单下拉菜单下添加了一个工具栏按钮和一个菜单项Show blocks。
wordcount 这个插件将计数单词的功能添加到TinyMCE编辑器中，方法是在状态栏的右边放置一个计数器。在状态栏中单击Word Count可以在计算单词和字符之间切换。可以使用“工具”下拉菜单项或“工具栏”按钮打开包含单词和字符计数的对话框。

*/
import tinymce from "tinymce/tinymce";
import tinymceVue from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/paste";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/fullpage";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/hr";
import "tinymce/plugins/preview";
import "tinymce/plugins/print";
import "tinymce/plugins/autosave";
import "tinymce/plugins/bbcode";
import "tinymce/plugins/charmap";
import "tinymce/plugins/directionality";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/legacyoutput";
import "tinymce/plugins/link";
import "tinymce/plugins/noneditable";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/tabfocus";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/wordcount";
export default {
  name: "tinymce-editor",
  components: {
    tinymceVue
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        "lists image imagetools media table  bbcode  anchor autolink autoresize code codesample paste nonbreaking insertdatetime fullscreen searchreplace pagebreak hr preview print advlist autosave charmap directionality  fullpage  legacyoutput link noneditable quickbars spellchecker tabfocus textpattern visualblocks wordcount"
    },
    toolbar: {
      type: [String, Array],
      default:
        "formatselect | bold italic underline  forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | image media | table | removeformat | anchor  | code | codesample | paste | nonbreaking | insertdatetime | fullscreen | searchreplace | pagebreak | hr | preview | print | restoredraft | charmap | ltr rtl  visualblocks|  fullpage | link | spellchecker | wordcount | undo redo "
    },
    imagesUploadHandler: {
      //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
      //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
      type: Function,
      default: (blobInfo, success, failure) => {
        const img = "data:image/jpeg;base64," + blobInfo.base64();
        success(img);
      }
    },
    width: {
      // 编辑器宽
      type: [Number, String],
      default: "100%"
    },
    height: {
      // 编辑器高
      type: [Number, String],
      default: 50
    },
    menubar: {
      // 隐藏最上方menu
      type: [String, Boolean],
      default: false
    },
    branding: {
      // 去水印
      type: [String, Boolean],
      default: false
    },
    autoresizeBottomMargin: {
      // 编辑器底部距离
      type: [String, Number],
      default: 50
    },
    elementpath: {
      //禁用编辑器底部的状态栏
      type: Boolean,
      default: false
    },
    pasteDataImages: {
      // 允许粘贴图像
      type: Boolean,
      default: true
    },
    statusbar: {
      // 隐藏编辑器底部的状态栏
      type: Boolean,
      default: true
    },
    browserSpellcheck: {
      // 拼写检查
      type: Boolean,
      default: true
    },
    inits: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      //初始化配置
      init: {
        ...this.inits,
        language_url: "/static/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: "/static/tinymce/skins/ui/oxide",
        browser_spellcheck: this.browserSpellcheck, // 拼写检查
        branding: this.branding, // 去水印
        elementpath: this.elementpath, //禁用编辑器底部的状态栏
        statusbar: this.statusbar, // 隐藏编辑器底部的状态栏
        paste_data_images: this.pasteDataImages, // 允许粘贴图像
        menubar: this.menubar, // 隐藏最上方menu
        height: this.height,
        width: this.width,
        plugins: this.plugins,
        toolbar: this.toolbar,
        paste_as_text: true,
        images_upload_handler: this.imagesUploadHandler,
        codesample_languages: [
          { text: "HTML/XML", value: "markup" },
          { text: "JavaScript", value: "javascript" },
          { text: "CSS", value: "css" },
          { text: "PHP", value: "php" },
          { text: "Ruby", value: "ruby" },
          { text: "Python", value: "python" },
          { text: "Java", value: "java" },
          { text: "C", value: "c" },
          { text: "C#", value: "csharp" },
          { text: "C++", value: "cpp" }
        ],
        autoresize_bottom_margin: this.autoresizeBottomMargin,
        content_css: [
          "/static/tinymce/skins/ui/codepen/font-face.css?family=Lato:300,300i,400,400i",
          "/static/tinymce/skins/ui/codepen/codepen.min.css"
        ],
        charmap: [
          [160, "no-break space"],
          [173, "soft hyphen"],
          [34, "quotation mark"],
          [8205, "zero width joiner"],
          [8206, "left-to-right mark"],
          [8207, "right-to-left mark"]
        ],
        textpattern_patterns: [
          { start: "*", end: "*", format: "italic" },
          { start: "**", end: "**", format: "bold" },
          {
            start: "~",
            end: "~",
            cmd: "createLink",
            value: "https://tiny.cloud"
          }
        ]
      }
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
    handlerFunction(val) {
      console.log(val);
    }
  },
  computed: {
    myValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {}
};
</script>
<style scoped></style>
