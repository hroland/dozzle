<template>
  <scrollable-view :scrollable="scrollable" v-if="container">
    <template v-slot:header v-if="showTitle">
      <div class="columns is-vcentered px-4 py-4">
        <div class="column has-text-weight-bold is-family-monospace">
          {{ container.name }}
        </div>
        <div class="column is-narrow has-text-weight-bold">
          {{ container.state }}
        </div>
        <div class="column is-narrow" v-if="container.stat.memoryUsage !== null">
          <span class="has-text-weight-light">mem</span>
          <span class="has-text-weight-bold">
            {{ formatBytes(container.stat.memoryUsage) }}
          </span>
        </div>

        <div class="column is-narrow" v-if="container.stat.cpu !== null">
          <span class="has-text-weight-light">load</span>
          <span class="has-text-weight-bold"> {{ container.stat.cpu }}% </span>
        </div>
        <div class="column is-narrow" v-if="closable">
          <button class="delete is-medium" @click="$emit('close')"></button>
        </div>
      </div>
    </template>
    <template v-slot="{ setLoading }">
      <log-viewer-with-source :id="id" @loading-more="setLoading($event)"></log-viewer-with-source>
    </template>
  </scrollable-view>
</template>

<script>
import { mapGetters } from "vuex";

import LogViewerWithSource from "./LogViewerWithSource";
import ScrollableView from "./ScrollableView";
import ContainerTitle from "./ContainerTitle";
import ContainerStat from "./ContainerStat";

export default {
  props: {
    id: {
      type: String,
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: false,
    },
  },
  name: "LogContainer",
  components: {
    LogViewerWithSource,
    ScrollableView,
    ContainerTitle,
    ContainerStat,
  },
  computed: {
    ...mapGetters(["allContainersById"]),
    container() {
      return this.allContainersById[this.id];
    },
  },
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
  },
};
</script>
<style lang="scss" scoped>
button.delete {
  background-color: var(--scheme-main-ter);
  opacity: 0.6;
  &:after,
  &:before {
    background-color: var(--text-color);
  }

  &:hover {
    opacity: 1;
  }
}
</style>
