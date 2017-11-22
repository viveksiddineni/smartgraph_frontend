import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Renderer2} from '@angular/core';
import {unescape} from 'querystring';

@Component({
  selector: 'download-button',
  template: `
      <button mat-button>Download current graph <i class="material-icons">file_download</i></button>

`,
  styleUrls: ['./download-button.component.css']
})
export class DownloadButtonComponent implements OnInit {
  @ViewChild('#svg') el: ElementRef;

  constructor(private rd: Renderer2) {
  }

  ngOnInit() {
    console.log(this.rd.data);
    console.log(this.el);
  }

  ngAfterViewInit() {
    //  var div = this.elRef.nativeElement.querySelector('#');
    //  console.log(div);
    console.log(this.rd);
    console.log(this.el);
  }

  //


  downloadFile(data: any, options: any) {
    console.log('downloading');
    const svgString = this.getSVGString(data.node());
    this.svgString2Image( svgString, 2 * options.width, 2 * options.height, save ); //  passes Blob and filesize String to the callback

    function save( dataBlob ){
      console.log(dataBlob);
     //  saveAs( dataBlob, 'D3 vis exported to PNG.png' ); //  FileSaver.js function
    }
   /* let image = new Image();
    image.src = 'data:image/svg+xml;base64,' + window.btoa(encodeURIComponent(svgString));
    console.log(image);
    let blob = new Blob([image], {type: 'image/png;charset=utf-8'});
    console.log(blob);
    let url = window.URL.createObjectURL(blob);
    console.log(url);
    window.open(url);*/
  }

  //  Below are the functions that handle actual exporting:
  getSVGString(svgNode) {
    svgNode.setAttribute('xlink', 'http:// www.w3.org/1999/xlink');
    const cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); //  Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); //  Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
      const selectorTextArr = [];

      //  Add Parent element Id and Classes to the list
      selectorTextArr.push('#' + parentElement.id);
      for (const classType of parentElement.classList) {
        if (!contains('.' + classType, selectorTextArr)) {
          selectorTextArr.push('.' + classType);
        }
      }
      //  Add Children element Ids and Classes to the list
      const nodes = parentElement.getElementsByTagName('*');
      for (const node of nodes) {
        const id = node.uuid;
        if (!contains('#' + id, selectorTextArr)) {
          selectorTextArr.push('#' + id);
        }
        const classes = node.classList;
        for (const nodeClass of classes) {
          if (!contains('.' + nodeClass, selectorTextArr)) {
            selectorTextArr.push('.' + nodeClass);
          }
        }
      }

      //  Extract CSS Rules
      let extractedCSSText = '';
      for (let r = 0; r < document.styleSheets.length; r++) {
        const css = document.styleSheets[r];
        try {
          if (!(css instanceof CSSStyleSheet)) continue;
        } catch (e) {
          if (e.name !== 'SecurityError') throw e; //  for Firefox
          continue;
        }
        //  Now TypeScript knows that your sheet is CSS sheet
        if (css) {
          const rules = css.cssRules ? css.cssRules : css.rules;
          if (rules) {
            for (let i = 0; i < rules.length; i++) {
              const rule = rules[i];
              if (!( rule instanceof CSSStyleRule )) continue;
              if (contains(rule.selectorText.split('[')[0], selectorTextArr))
                extractedCSSText += rule.cssText;
            }
          }
        }
      }

      return extractedCSSText;

      function contains(str, arr) {
        return arr.indexOf(str) !== -1;
      }

    }

    function appendCSS(cssText, element) {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('type', 'text/css');
      styleElement.innerHTML = cssText;
      const refNode = element.hasChildNodes() ? element.children[0] : null;
      element.insertBefore(styleElement, refNode);
    }
  }

     svgString2Image(svgString, width, height, callback) {
      const imgsrc = 'data:image/svg+xml;base64,' + btoa(svgString); //  Convert SVG string to data URL

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      const image = new Image();
       image.src = imgsrc;
       image.onload = function () {
         context.clearRect(0, 0, width, height);


        context.drawImage(image, 0, 0, width, height);
console.log(context);

      //     console.log(blob);
      //   });
      };

       const blob = new Blob([image], {type: 'image/png;charset=utf-8'});
      console.log(canvas);
      console.log(blob);
      console.log(image);
    }
}
