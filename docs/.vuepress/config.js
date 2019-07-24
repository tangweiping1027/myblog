module.exports = {
  title: "Tang's blog",
  description: '我的个人网站',
  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }] // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  themeConfig: {
    nav: [
      // 导航栏配置
      { text: '首页', link: '/' },
      { text: '前端基础', link: '/web-base/' },
      {
        text: 'vue详情',
        items: [
          {
            text: 'vue组件',
            link: '/vue/component/'
          },
          {
            text: 'vue-cli3',
            link: '/vue/cli3/'
          }
        ]
      },
      { text: '微博', link: 'https://baidu.com' }
    ],
    sidebar: {
      collapsable: true,
      '/vue/component/': [
        {
          title: '组件1',
          children: [
            {
              title: '二级',
              children: [
                {
                  title: '三级',
                  children: [
                    {
                      title: '四级',
                      children: [
                        {
                          title: '五级',
                          children: ['', 'one', 'two']
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      '/vue/cli3/': ['', 'config'],
      '/web-base/': [
        'design-schema/',
        {
          title: 'js常用技巧',
          collapsable: true,

          children: ['regular-skill/']
        },
        'markdown/',
        'nodeJs/'
      ]
      // '/web-base/': {
      //   title: '设计模式',
      //   collapsable: true,
      //   children: []
      // }
    },

    sidebarDepth: 2 // 默认深度是 1，它提取 h2 标题。将其设置为 0 将禁用标题链接，最大值为2，同时提取 h2 和 h3 标题。
  }
}
