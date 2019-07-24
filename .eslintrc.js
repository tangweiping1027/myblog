module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: 0,
    quotes: [0, "single"],
    "padded-blocks": 0,
    "no-unused-vars": [0, { vars: "all", args: "after-used" }]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
