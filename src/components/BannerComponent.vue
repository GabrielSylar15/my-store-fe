<template>
  <div class="w-full h-[400px] overflow-hidden bg-black">
    <a-carousel :arrows="true" :autoplay="true" :autoplaySpeed="1500" :dots="true">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <left-circle-outlined/>
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <right-circle-outlined/>
        </div>
      </template>

      <a-image
          v-for="(thumbId, index) in thumbnails"
          :key="index"
          :src="getImageUrl(thumbId)"
          alt="Banner"
          class="image-slide"
          :preview="false"
          fit="cover"
          height="400px"
          width="100%"
      />

    </a-carousel>
  </div>
</template>

<script lang="ts" setup>
import {LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons-vue';
import {onMounted} from 'vue';
import {useBannerSlider} from '@/services/bannerService'

const {
  thumbnails,
  getImageUrl,
  fetchThumbnails,
} = useBannerSlider()

onMounted(() => {
  fetchThumbnails()
})

</script>
<style scoped>
/*noinspection CssUnusedSymbol*/
:deep(.ant-image-img) {
  object-fit: cover;
}

/*noinspection CssUnusedSymbol*/
:deep(.slick-slide) {
  text-align: center;
  height: 400px;
  line-height: 400px;
  background: #364d79;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
}

/*noinspection CssUnusedSymbol*/
:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}

/*noinspection CssUnusedSymbol*/
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}

/*noinspection CssUnusedSymbol*/
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

:deep(.slick-dots li button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.5;
  border: none;
}

:deep(.slick-dots li.slick-active button) {
  opacity: 1;
  background-color: #1890ff;
}

/*noinspection CssUnusedSymbol*/
:deep(.slick-slide) {
  text-align: center;
  height: 400px;
  line-height: 400px;
  background: #364d79;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

