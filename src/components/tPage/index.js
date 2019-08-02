import tPage from "./src";
import btns from "./src/btns";
import search from "./src/search";
import table from "./src/table";
export default {
  install: Vue => {
    Vue.component(tPage.name, tPage);
    Vue.component(btns.name, btns);
    Vue.component(search.name, search);
    Vue.component(table.name, table);
  }
};
