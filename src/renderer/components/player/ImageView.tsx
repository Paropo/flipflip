import * as React from 'react';

const maxFadeSeconds = 5;

export default class ImageView extends React.Component {
  readonly props: {
    img: HTMLImageElement,
    fadeState: string,
    fadeDuration: number,
  };

  readonly contentRef: React.RefObject<HTMLImageElement> = React.createRef();

  componentDidMount() {
    this._applyImage();
  }

  shouldComponentUpdate(props: any, state: any): boolean {
    return props.fadeDuration !== this.props.fadeDuration || props.fadeState !== this.props.fadeState ||
           props.img.src !== this.props.img.src;
  }

  componentDidUpdate() {
    this._applyImage();
  }

  _applyImage() {
    const el = this.contentRef.current;
    const img = this.props.img;
    if (!el || !img) return;

    const firstChild = el.firstChild;
    if (firstChild instanceof HTMLImageElement) {
      if (firstChild.src === img.src) return;
    }

    const parentWidth = el.offsetWidth;
    const parentHeight = el.offsetHeight;
    const parentAspect = parentWidth / parentHeight;
    const imgWidth = img.width;
    const imgHeight = img.height;
    const imgAspect = imgWidth / imgHeight;

    if (imgAspect < parentAspect) {
      const scale = parentHeight / imgHeight;
      img.style.width = 'auto';
      img.style.height = '100%';
      img.style.marginTop = '0';
      img.style.marginLeft = (parentWidth / 2 - imgWidth * scale / 2) + 'px';
    } else {
      const scale = parentWidth / imgWidth;
      img.style.height = 'auto';
      img.style.width = '100%';
      img.style.marginTop = (parentHeight / 2 - imgHeight * scale / 2) + 'px';
      img.style.marginLeft = '0';
    }

    if (firstChild) {
      el.removeChild(firstChild);
    }
    el.appendChild(img);
  }

  render() {
    let style = {};
    const fadeDuration = Math.min(maxFadeSeconds, (this.props.fadeDuration / 1000)) + 's';
    if (this.props.fadeState === 'in') {
      style = {
        animationName: 'fadeIn',
        opacity: 1,
        animationDuration: fadeDuration,
      };
    } else if (this.props.fadeState === 'out') {
      style = {
        animationName: 'fadeOut',
        opacity: 0,
        animationDuration: fadeDuration,
      };
    }
    return (
      <div
        className="ImageView u-fill-container"
        style={style}
        ref={this.contentRef}>
      </div>);
  }
}
