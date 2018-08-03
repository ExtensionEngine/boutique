<template>
  <div class="field">
    <div class="image-container">
      <label class="label">{{ label }}</label>
      <img
        v-if="showPlaceholderImage"
        :src="placeholderImage.url"
        :width="imageWidth"
        :height="imageHeight"
        class="placeholder-image"/>
      <croppa
        v-show="!showPlaceholderImage"
        @file-choose="onImageReady"
        @file-size-exceed="onImageSizeExceeded"
        v-model="imageCropper"
        :width="imageWidth"
        :height="imageHeight"
        :replace-drop="true"
        :prevent-white-space="true"
        :show-remove-button="false"
        :file-size-limit="sizeLimitInBytes"
        :accept="imageInputType"
        data-vv-delay="1000">
        <transition name="fade">
        <div
          v-if="hasImage"
          class="zoom-controls">
          <button
            type="button"
            @click="imageCropper.zoom(true, 5)"
            class="zoom">
            <span
              class="icon is-medium mdi mdi-36px mdi-magnify-plus-outline">
            </span>
          </button>       
          <button
            type="button"
            @click="imageCropper.zoom(false, 5)"
            class="zoom">
            <span
              class="icon is-medium mdi mdi-36px mdi-magnify-minus-outline">
            </span>
            </button>
        </div>
        </transition>
      </croppa>
    </div>
    <div class="file-choose-btn-container">
      <transition name="fade">
      <button
        @click="openFileSelectionWindow"
        v-if="fileSelectionButton.enable"
        :style="fileSelectionButton.text ? '' : 'visibility: hidden;'"
        type="button"
        class="button is-light is-small file-choose-btn">
        {{ fileSelectionButton.text }}
      </button>
      </transition>
    </div>
    <p v-if="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';
import humanFormat from 'human-format';

const imageDimension = {
  type: Number,
  default: 200,
  validator: value => value > 0 && value <= 500
};
const sizeLimitFallback = '100 kB';

export default {
  name: 'v-image',
  props: {
    name: { type: String, required: true },
    sizeLimit: {
      type: String,
      validator: value => {
        try {
          let parsedSize = humanFormat.parse(value);
          return parsedSize > 0 && parsedSize <= humanFormat.parse('100 MB');
        } catch (err) {
          return false;
        }
      }
    },
    fileInputTypes: { type: Array, default: () => ['image/jpeg', 'image/png'] },
    fileOutputType: { type: String, default: 'image/jpeg' },
    imageWidth: imageDimension,
    imageHeight: imageDimension,
    placeholderImage: {
      url: { type: String, default: '' },
      show: { type: Boolean, default: false }
    },
    fileSelectionButton: {
      enable: { type: Boolean, default: false },
      text: { type: String, default: '' }
    }
  },
  data() {
    return { imageCropper: {} };
  },
  computed: {
    hasImage() {
      return this.imageCropper.imageSet;
    },
    imageInputType() {
      return this.fileInputTypes.join(',');
    },
    sizeLimitInBytes() {
      try {
        return humanFormat.parse(this.sizeLimit);
      } catch (err) {
        return humanFormat.parse(sizeLimitFallback);
      }
    },
    showPlaceholderImage() {
      return this.placeholderImage.show || (this.showError && !this.hasImage &&
        this.placeholderImage.url);
    },
    label() {
      return humanize(this.name);
    },
    showError() {
      return this.vErrors.has(this.name);
    }
  },
  methods: {
    toBlob() {
      return new Promise((resolve, reject) => {
        if (!this.imageCropper.imageSet) resolve(null);
        this.imageCropper.getCanvas().toBlob(
          blob => resolve(blob),
          this.fileOutputType,
          0.8
        );
      });
    },
    openFileSelectionWindow() {
      this.imageCropper.chooseFile();
    },
    reset() {
      this.imageCropper.remove();
      this.vErrors.clear();
    },
    onImageSizeExceeded() {
      this.vErrors.add({
        field: this.name,
        msg: `The image is too large. Maximum image size: ${this.sizeLimit}`
      });
    },
    onImageReady(file) {
      // TODO: find a better means of validating the image?
      if (file.size <= this.sizeLimitInBytes) {
        this.$emit('imageReady', true);
        this.vErrors.clear();
      } else {
        this.$emit('imageReady', false);
      }
    }
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.image-container {
  display: inline-grid;

  .label {
    text-align: left;
  }
}

.croppa-container, .placeholder-image {
  box-sizing: content-box;
  border: 2px solid #aaa;
}

.field {
  text-align: center;
}

.zoom {
  display: block;
  color: #222;
  text-shadow: 1px 1px 10px #fff, 2px 2px 10px #fff, -1px -1px 10px #fff;
  background: transparent;
  border: none;
  cursor: pointer;

  &-controls {
    display: table;
    position: absolute;
    right: 1px;
    bottom: 1px;
    flex-direction: column;
  }
}

.file-choose-btn-container {
  display: block;
  text-align: center;
  margin-top: 0.5em;
}

.fade-enter-active {
  transition: opacity 2s;
}

.fade-enter {
  opacity: 0;
}
</style>
