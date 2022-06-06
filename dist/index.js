'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var plateCore = require('@udecode/plate-core');
var plateBlockQuote = require('@udecode/plate-block-quote');
var plateCodeBlock = require('@udecode/plate-code-block');
var plateHeading = require('@udecode/plate-heading');
var plateLink = require('@udecode/plate-link');
var plateList = require('@udecode/plate-list');
var plateParagraph = require('@udecode/plate-paragraph');
var remarkParse = require('remark-parse');
var slate = require('remark-slate');
var unified = require('unified');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var remarkParse__default = /*#__PURE__*/_interopDefaultLegacy(remarkParse);
var slate__default = /*#__PURE__*/_interopDefaultLegacy(slate);

const MARK_BOLD = 'bold';
/**
 * Enables support for bold formatting
 */

const createBoldPlugin = plateCore.createPluginFactory({
  key: MARK_BOLD,
  isLeaf: true,
  deserializeHtml: {
    rules: [{
      validNodeName: ['STRONG', 'B']
    }, {
      validStyle: {
        fontWeight: ['600', '700', 'bold']
      }
    }],
    query: el => !plateCore.someHtmlElement(el, node => node.style.fontWeight === 'normal')
  },
  handlers: {
    onKeyDown: plateCore.onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+b'
  }
});
const MARK_CODE = 'code';
/**
 * Enables support for code formatting
 */

const createCodePlugin = plateCore.createPluginFactory({
  key: MARK_CODE,
  isLeaf: true,
  deserializeHtml: {
    rules: [{
      validNodeName: ['CODE']
    }, {
      validStyle: {
        wordWrap: 'break-word'
      }
    }, {
      validStyle: {
        fontFamily: 'Consolas'
      }
    }],

    query(el) {
      const blockAbove = plateCore.findHtmlParentElement(el, 'P');
      if ((blockAbove === null || blockAbove === void 0 ? void 0 : blockAbove.style.fontFamily) === 'Consolas') return false;
      return !plateCore.findHtmlParentElement(el, 'PRE');
    }

  },
  handlers: {
    onKeyDown: plateCore.onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+e'
  }
});
const MARK_ITALIC = 'italic';
/**
 * Enables support for italic formatting.
 */

const createItalicPlugin = plateCore.createPluginFactory({
  key: MARK_ITALIC,
  isLeaf: true,
  handlers: {
    onKeyDown: plateCore.onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+i'
  },
  deserializeHtml: {
    rules: [{
      validNodeName: ['EM', 'I']
    }, {
      validStyle: {
        fontStyle: 'italic'
      }
    }],
    query: el => !plateCore.someHtmlElement(el, node => node.style.fontStyle === 'normal')
  }
});
const MARK_STRIKETHROUGH = 'strikethrough';
/**
 * Enables support for strikethrough formatting.
 */

const createStrikethroughPlugin = plateCore.createPluginFactory({
  key: MARK_STRIKETHROUGH,
  isLeaf: true,
  handlers: {
    onKeyDown: plateCore.onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+shift+x'
  },
  deserializeHtml: {
    rules: [{
      validNodeName: ['S', 'DEL', 'STRIKE']
    }, {
      validStyle: {
        textDecoration: 'line-through'
      }
    }],
    query: el => !plateCore.someHtmlElement(el, node => node.style.textDecoration === 'none')
  }
});
const MARK_SUBSCRIPT$1 = 'subscript';
const MARK_SUPERSCRIPT$1 = 'superscript';
/**
 * Enables support for subscript formatting.
 */

const createSubscriptPlugin = plateCore.createPluginFactory({
  key: MARK_SUBSCRIPT$1,
  isLeaf: true,
  handlers: {
    onKeyDown: plateCore.onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+,',
    clear: MARK_SUPERSCRIPT$1
  },
  deserializeHtml: {
    rules: [{
      validNodeName: ['SUB']
    }, {
      validStyle: {
        verticalAlign: 'sub'
      }
    }]
  }
});
const MARK_SUPERSCRIPT = 'superscript';
const MARK_SUBSCRIPT = 'subscript';
/**
 * Enables support for superscript formatting.
 */

const createSuperscriptPlugin = plateCore.createPluginFactory({
  key: MARK_SUPERSCRIPT,
  isLeaf: true,
  handlers: {
    onKeyDown: plateCore.onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+.',
    clear: MARK_SUBSCRIPT
  },
  deserializeHtml: {
    rules: [{
      validNodeName: ['SUP']
    }, {
      validStyle: {
        verticalAlign: 'super'
      }
    }]
  }
});
const MARK_UNDERLINE = 'underline';
/**
 * Enables support for underline formatting.
 */

const createUnderlinePlugin = plateCore.createPluginFactory({
  key: MARK_UNDERLINE,
  isLeaf: true,
  handlers: {
    onKeyDown: plateCore.onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+u'
  },
  deserializeHtml: {
    rules: [{
      validNodeName: ['U']
    }, {
      validStyle: {
        textDecoration: ['underline']
      }
    }],
    query: el => !plateCore.someHtmlElement(el, node => node.style.textDecoration === 'none')
  }
});
/**
 * Enables support for basic marks:
 * - Bold
 * - Code
 * - Italic
 * - Strikethrough
 * - Subscript
 * - Superscript
 * - Underline
 */

plateCore.createPluginFactory({
  key: 'basicMarks',
  plugins: [createBoldPlugin(), createCodePlugin(), createItalicPlugin(), createStrikethroughPlugin(), createSubscriptPlugin(), createSuperscriptPlugin(), createUnderlinePlugin()]
});

const ELEMENT_HR = 'hr';
plateCore.createPluginFactory({
  key: ELEMENT_HR,
  isElement: true,
  isVoid: true,
  deserializeHtml: {
    rules: [{
      validNodeName: 'HR'
    }]
  }
});

/**
 * Deserialize content from Markdown format to Slate format.
 * `editor` needs
 */

const deserializeMd = (editor, data) => {
  const tree = unified.unified().use(remarkParse__default["default"]).use(slate__default["default"], {
    nodeTypes: {
      paragraph: plateCore.getPluginType(editor, plateParagraph.ELEMENT_PARAGRAPH),
      block_quote: plateCore.getPluginType(editor, plateBlockQuote.ELEMENT_BLOCKQUOTE),
      link: plateCore.getPluginType(editor, plateLink.ELEMENT_LINK),
      inline_code_mark: plateCore.getPluginType(editor, MARK_CODE),
      emphasis_mark: plateCore.getPluginType(editor, MARK_ITALIC),
      strong_mark: plateCore.getPluginType(editor, MARK_BOLD),
      delete_mark: plateCore.getPluginType(editor, MARK_STRIKETHROUGH),
      // FIXME: underline, subscript superscript not yet supported by remark-slate
      // underline: getPluginType(editor, MARK_UNDERLINE),
      // subscript: getPluginType(editor, MARK_SUBSCRIPT),
      // superscript: getPluginType(editor, MARK_SUPERSCRIPT),
      code_block: plateCore.getPluginType(editor, plateCodeBlock.ELEMENT_CODE_BLOCK),
      thematic_break: plateCore.getPluginType(editor, ELEMENT_HR),
      ul_list: plateCore.getPluginType(editor, plateList.ELEMENT_UL),
      ol_list: plateCore.getPluginType(editor, plateList.ELEMENT_OL),
      listItem: plateCore.getPluginType(editor, plateList.ELEMENT_LI),
      heading: {
        1: plateCore.getPluginType(editor, plateHeading.ELEMENT_H1),
        2: plateCore.getPluginType(editor, plateHeading.ELEMENT_H2),
        3: plateCore.getPluginType(editor, plateHeading.ELEMENT_H3),
        4: plateCore.getPluginType(editor, plateHeading.ELEMENT_H4),
        5: plateCore.getPluginType(editor, plateHeading.ELEMENT_H5),
        6: plateCore.getPluginType(editor, plateHeading.ELEMENT_H6)
      }
    },
    linkDestinationKey: 'url'
  }).processSync(data);
  return tree.result;
};

function filterBreaklines(item) {
  return !item.text;
}

const KEY_DESERIALIZE_MD = 'deserializeMd';
const createDeserializeMdPlugin = plateCore.createPluginFactory({
  key: KEY_DESERIALIZE_MD,
  then: editor => ({
    editor: {
      insertData: {
        format: 'text/plain',
        query: ({
          data,
          dataTransfer
        }) => {
          const htmlData = dataTransfer.getData('text/html');
          if (htmlData) return false;
          const {
            files
          } = dataTransfer;

          if (!(files !== null && files !== void 0 && files.length)) {
            // if content is simply a URL pass through to not break LinkPlugin
            if (plateCore.isUrl(data)) {
              return false;
            }
          }

          return true;
        },
        getFragment: ({
          data
        }) => deserializeMd(editor, data)
      }
    }
  })
});

exports.KEY_DESERIALIZE_MD = KEY_DESERIALIZE_MD;
exports.createDeserializeMdPlugin = createDeserializeMdPlugin;
exports.deserializeMd = deserializeMd;
exports.filterBreaklines = filterBreaklines;
//# sourceMappingURL=index.js.map
