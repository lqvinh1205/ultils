<template>
  <RecordWrapper>
    <font-icon
      :name="iconName"
      :size="size"
      color="mineShaft"
      cursor
      @click.native="toggleRecorder"
    />
  </RecordWrapper>
</template>

<script>
import Recorder from "./lib/recorder";
import UploaderPropsMixin from "./mixins/uploader-props";
import { RecordWrapper } from "./styled";

export default {
  mixins: [UploaderPropsMixin],
  props: {
    time: { type: Number },

    bitRate: { type: Number, default: 128 },
    sampleRate: { type: Number, default: 44100 },

    showDownloadButton: { type: Boolean, default: true },
    showUploadButton: { type: Boolean, default: true },

    micFailed: { type: Function },
    beforeRecording: { type: Function },
    pauseRecording: { type: Function },
    afterRecording: { type: Function },
    failedUpload: { type: Function },
    beforeUpload: { type: Function },
    successfulUpload: { type: Function },
    selectRecord: { type: Function },
    size: { type: String, default: "30" },
  },
  data() {
    return {
      isUploading: false,
      recorder: this._initRecorder(),
      recordList: [],
      selected: {},
      uploadStatus: null,
    };
  },
  components: {
    RecordWrapper,
  },
  beforeDestroy() {
    this.stopRecorder();
  },
  methods: {
    toggleRecorder() {
      if (!this.isRecording) {
        this.recorder.start();
      } else {
        this.recorder.stop();
      }
    },
    stopRecorder() {
      if (this.isRecording) {
        this.recorder.stop();
      }
    },
    _initRecorder() {
      return new Recorder({
        beforeRecording: this.beforeRecording,
        afterRecording: this.afterRecording,
        pauseRecording: this.pauseRecording,
        micFailed: this.micFailed,
        bitRate: this.bitRate,
        sampleRate: this.sampleRate,
        format: this.format,
      });
    },
  },
  computed: {
    iconName() {
      return this.isRecording ? "pause_icon" : "micro";
    },
    isPause() {
      return this.recorder.isPause;
    },
    isRecording() {
      return this.recorder.isRecording;
    },
    recorderDuration() {
      return this.recorder.duration;
    },
  },
  watch: {
    recorderDuration(data) {
      if (data > 60) {
        this.stopRecorder();
        this.$toast.info(this.$t("voice_message_maximum"));
      }
    },
  },
};
</script>
