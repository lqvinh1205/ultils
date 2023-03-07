<template>
  <Wrapper ref="cameraWrapper">
    <font-icon
      v-if="!isCameraOpen"
      @click.native="toggleCamera"
      name="camera"
      :size="sizeIcon"
      color="mineShaft"
      cursor
    />
    <MainContent v-else>
      <div v-show="isLoading">
        <spin-loading />
      </div>
      <div v-show="!isLoading">
        <video ref="camera" v-show="!isPhotoTaken" webkit-playsinline playsinline autoplay></video>

        <canvas
          v-show="isPhotoTaken"
          id="photoTaken"
          ref="canvas"
          :height="640"
          :width="480"
        ></canvas>
      </div>
    </MainContent>
    <div v-if="isCameraOpen">
      <MainAction>
        <font-icon
          :name="nameIcon"
          size="55"
          @click.native="takePhoto"
          :color="colorIcon"
          :cursor="true"
        />
      </MainAction>
      <Close>
        <font-icon
          name="close"
          size="40"
          @click.native="toggleCamera"
          color="white"
          :cursor="true"
        />
      </Close>
      <RevertCamera>
        <font-icon
          name="camera"
          size="25"
          @click.native="toggleCameraType"
          color="white"
          :cursor="true"
        />
      </RevertCamera>
    </div>
  </Wrapper>
</template>

<script>
import FontIcon from "../FontIcon";
import SpinLoading from "../SpinLoading";
import {
  Wrapper,
  ButtonTakePhoto,
  ButtonChangeType,
  MainContent,
  MainAction,
  Close,
  RevertCamera,
} from "./styled";
export default {
  name: "Camera",
  components: {
    Wrapper,
    ButtonTakePhoto,
    ButtonChangeType,
    MainContent,
    MainAction,
    Close,
    RevertCamera,
    FontIcon,
    SpinLoading,
  },
  props: {
    sizeIcon: { type: String, default: "30" },
    handleSubmit: { type: Function },
  },
  data() {
    return {
      isCameraOpen: false,
      isPhotoTaken: false,
      isLoading: false,
      cameraType: "environment",
    };
  },
  computed: {
    nameIcon() {
      return this.isPhotoTaken ? "send" : "ellipse";
    },
    colorIcon() {
      return this.isPhotoTaken ? "chateauGreen" : "white";
    },
  },
  methods: {
    toggleCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },

    toggleCameraType() {
      if (
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ) {
        alert("You dont have another camera to switch to");
        return;
      }
      if (this.isCameraOpen) {
        this.toggleCamera();
      }
      this.cameraType = this.cameraType === "user" ? "environment" : "user";
      this.toggleCamera();
    },

    createCameraElement() {
      let type;
      if (
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ) {
        type = true;
      } else {
        type = {
          facingMode: {
            exact: this.cameraType,
          },
        };
      }
      this.isLoading = true;
      const constraints = (window.constraints = {
        audio: false,
        video: type,
      });
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          this.isLoading = false;
          this.isCameraOpen = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },

    takePhoto() {
      if (this.isPhotoTaken) {
        this.uploadImage();
        return;
      }
      this.isPhotoTaken = !this.isPhotoTaken;
      const context = this.$refs.canvas.getContext("2d");
      context.drawImage(this.$refs.camera, 0, 0);
    },

    async uploadImage() {
      try {
        let dataURL = this.$refs.canvas.toDataURL();
        var file = this.dataURItoBlob(dataURL);
        await this.handleSubmit(file);
        this.toggleCamera();
      } catch (error) {
        this.$toast.error(error.error || error.message);
      }
    },

    dataURItoBlob(dataURI) {
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
  },
};
</script>

/**
  ----upload image blob to api----
  export const uploadImageBlob = async (questionID, data) => {
    const formData = new FormData();
    formData.append("content", data);
    formData.append("type", "2");
    return await api.post(
      `${apiConstants.QUESTIONS}/${questionID}${apiConstants.ANSWER}/upload`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      }
    );
  };
 */