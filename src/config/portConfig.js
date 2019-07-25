export default {
  // 开发环境
  dev: {
    loginRedirect: "/",
    LOGIN_URL: "http://192.168.0.98:7081",
    PERMS_URL: "http://192.168.0.98:7082",
    PRODUCT_URL: "http://192.168.0.98:7083",
    PROCUREMENT_URL: "http://192.168.0.98:7085",
    ORDER_URL: "http://192.168.0.98:7086",
    EMAIL_URL: "http://192.168.0.98:7087",
    WAREHOUSE_URL: "http://192.168.0.98:7089",
    FINANCE_URL: "http://192.168.0.98:7090"
  },
  // 打包生产环境
  prod: {
    loginRedirect: "/",
    LOGIN_URL: "http://192.168.0.98:7081",
    PERMS_URL: "http://192.168.0.98:7082",
    PRODUCT_URL: "http://192.168.0.98:7083",
    PROCUREMENT_URL: "http://192.168.0.98:7085",
    ORDER_URL: "http://192.168.0.98:7086",
    EMAIL_URL: "http://192.168.0.98:7087",
    WAREHOUSE_URL: "http://192.168.0.98:7089",
    FINANCE_URL: "http://192.168.0.98:7090"
  },
  // 沙盒环境（勿改）
  test_env: {
    loginRedirect: "/test-env/",
    LOGIN_URL: "http://192.168.0.98:7081",
    PERMS_URL: "http://192.168.0.98:7082",
    PRODUCT_URL: "http://192.168.0.98:7083",
    PROCUREMENT_URL: "http://192.168.0.98:7085",
    ORDER_URL: "http://192.168.0.98:7086",
    EMAIL_URL: "http://192.168.0.98:7087",
    WAREHOUSE_URL: "http://192.168.0.98:7089",
    FINANCE_URL: "http://192.168.0.98:7090"
  },
  // 测试环境（勿改）
  test: {
    loginRedirect: "/",
    LOGIN_URL: "http://192.168.0.98:8081",
    PERMS_URL: "http://192.168.0.98:8082",
    PRODUCT_URL: "http://192.168.0.98:8083",
    PROCUREMENT_URL: "http://192.168.0.98:8085",
    ORDER_URL: "http://192.168.0.98:8086",
    EMAIL_URL: "http://192.168.0.98:8087",
    WAREHOUSE_URL: "http://192.168.0.98:8089",
    FINANCE_URL: "http://192.168.0.98:8090"
  },
  // 线上环境（勿改）
  online: {
    loginRedirect: "/erp/",
    LOGIN_URL: "/erp-sso",
    PERMS_URL: "/erp-permission",
    PRODUCT_URL: "/erp-product",
    PROCUREMENT_URL: "/erp-purchase",
    ORDER_URL: "/erp-order",
    EMAIL_URL: "/erp-cus",
    WAREHOUSE_URL: "/erp-warehouse",
    FINANCE_URL: "/erp-finance"
  }
};
