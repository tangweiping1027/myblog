<template>
  <el-table-column
    :label="item.label || ''"
    :prop="item.value || ''"
    :width="item.width"
    :align="item.align || 'center'"
  >
    <template v-if="item.mult && Array.isArray(item.mult)">
      <nestingCusorm :item="j" v-for="(j, jindex) in item.mult" :key="jindex" />
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: ["item"],
  name: "nestingCusorm"
};
</script>

<style lang="scss"></style>
