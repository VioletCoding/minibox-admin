<!--个人中心-->
<template>
  <div>
    <div v-if="!loading">

      <a-row>
        <a-col :span="16">
          <a-page-header title="个人中心"/>
          <a-form-model :label-col="{span:2}"
                        :wrapper-col="{span:8}">
            <a-form-model-item label="昵称"
                               prop="nickname">
              <a-input placeholder="给自己起个名字"/>
            </a-form-model-item>
            <a-form-model-item label="个性签名"
                               prop="description">
              <a-textarea placeholder="写点关于自己的事儿吧"
                          autoSize/>
            </a-form-model-item>
            <a-form-model-item label="个人等级">
              <a-input disabled value="Lv 1"/>
            </a-form-model-item>
            <a-form-model-item label="登陆密码">
              <a>点击修改</a>
            </a-form-model-item>
          </a-form-model>
        </a-col>

        <a-col :span="8">
          <a-upload :before-upload="beforeUpload">
            <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                 style="width: 300px;height: 300px;border-radius: 50%"/>
          </a-upload>
        </a-col>
      </a-row>
      <!--使用VueCropper进行图片裁剪-->
      <a-modal :visible="modalVisible"
               @cancel="modalVisible=false"
               width="1200px" :bodyStyle="{height:'500px'}">
        <div style="display: flex;flex-direction: row">
          <div style="width: 800px;height: 500px;">
            <VueCropper
                ref="cropper"
                :img="cropperBase64"
                :autoCrop="true"
                :fixedBox="true"
                autoCropWidth="500"
                autoCropHeight="300"
                :centerBox="true"
                mode="cover"
                @realTime="realTime"/>
          </div>
          <!--裁剪预览图-->
          <div :style="previewStyle">
            <div :style="previews.div">
              <img :src="previews.url"
                   :style="previews.img"/>
            </div>
          </div>
        </div>
      </a-modal>

    </div>
    <div v-else>
      <MyLoading/>
    </div>
  </div>
</template>

<script>
import MyLoading from "@/component/MyLoading";
import { VueCropper } from 'vue-cropper';

export default {
  name: "MyPersonalCenter",
  components: {MyLoading, VueCropper},
  data() {
    return {
      //页面是否正在加载
      loading: false,
      //裁剪弹出框是否可见
      modalVisible: false,
      //用于裁剪的图片的base64
      cropperBase64: "",
      //预览
      previews: {},
      //预览的样式
      previewStyle: {}
    }
  },
  methods: {
    //上传之前
    async beforeUpload(file) {
      //读取文件
      let reader = new FileReader();
      //读取base64
      await reader.readAsDataURL(file);
      //在读取完成后
      reader.onload = () => {
        //获取读取结果并赋值用于裁剪
        this.cropperBase64 = reader.result;
        //弹出裁剪框
        this.modalVisible = true;
        //返回promise,resolve执行上传,reject停止上传
        return new Promise((resolve, reject) => {

        });
      }
    },
    //实时预览被裁剪的图片
    realTime(data) {
      //定义一些属性
      let previews = data;
      //缩放比例
      let h = 0.5;
      //预览样式
      this.previewStyle = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "50px",
        //缩放
        zoom: h
      };
      this.previews = previews;
    }

  }
}
</script>