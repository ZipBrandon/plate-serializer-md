import { createPluginFactory, someHtmlElement, onKeyDownToggleMark, findHtmlParentElement, getPluginType, isUrl } from '@udecode/plate-core';
import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import { ELEMENT_CODE_BLOCK } from '@udecode/plate-code-block';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6 } from '@udecode/plate-heading';
import { ELEMENT_LINK } from '@udecode/plate-link';
import { ELEMENT_UL, ELEMENT_OL, ELEMENT_LI } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import remarkParse from 'remark-parse';
import slate from 'remark-slate';
import { unified } from 'unified';

const MARK_BOLD = 'bold';
/**
 * Enables support for bold formatting
 */

const createBoldPlugin = createPluginFactory({
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
    query: el => !someHtmlElement(el, node => node.style.fontWeight === 'normal')
  },
  handlers: {
    onKeyDown: onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+b'
  }
});
const MARK_CODE = 'code';
/**
 * Enables support for code formatting
 */

const createCodePlugin = createPluginFactory({
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
      const blockAbove = findHtmlParentElement(el, 'P');
      if ((blockAbove === null || blockAbove === void 0 ? void 0 : blockAbove.style.fontFamily) === 'Consolas') return false;
      return !findHtmlParentElement(el, 'PRE');
    }

  },
  handlers: {
    onKeyDown: onKeyDownToggleMark
  },
  options: {
    hotkey: 'mod+e'
  }
});
const MARK_ITALIC = 'italic';
/**
 * Enables support for italic formatting.
 */

const createItalicPlugin = createPluginFactory({
  key: MARK_ITALIC,
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark
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
    query: el => !someHtmlElement(el, node => node.style.fontStyle === 'normal')
  }
});
const MARK_STRIKETHROUGH = 'strikethrough';
/**
 * Enables support for strikethrough formatting.
 */

const createStrikethroughPlugin = createPluginFactory({
  key: MARK_STRIKETHROUGH,
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark
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
    query: el => !someHtmlElement(el, node => node.style.textDecoration === 'none')
  }
});
const MARK_SUBSCRIPT$1 = 'subscript';
const MARK_SUPERSCRIPT$1 = 'superscript';
/**
 * Enables support for subscript formatting.
 */

const createSubscriptPlugin = createPluginFactory({
  key: MARK_SUBSCRIPT$1,
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark
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

const createSuperscriptPlugin = createPluginFactory({
  key: MARK_SUPERSCRIPT,
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark
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

const createUnderlinePlugin = createPluginFactory({
  key: MARK_UNDERLINE,
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark
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
    query: el => !someHtmlElement(el, node => node.style.textDecoration === 'none')
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

createPluginFactory({
  key: 'basicMarks',
  plugins: [createBoldPlugin(), createCodePlugin(), createItalicPlugin(), createStrikethroughPlugin(), createSubscriptPlugin(), createSuperscriptPlugin(), createUnderlinePlugin()]
});

const ELEMENT_HR = 'hr';
createPluginFactory({
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
  const tree = unified().use(remarkParse).use(slate, {
    nodeTypes: {
      paragraph: getPluginType(editor, ELEMENT_PARAGRAPH),
      block_quote: getPluginType(editor, ELEMENT_BLOCKQUOTE),
      link: getPluginType(editor, ELEMENT_LINK),
      inline_code_mark: getPluginType(editor, MARK_CODE),
      emphasis_mark: getPluginType(editor, MARK_ITALIC),
      strong_mark: getPluginType(editor, MARK_BOLD),
      delete_mark: getPluginType(editor, MARK_STRIKETHROUGH),
      // FIXME: underline, subscript superscript not yet supported by remark-slate
      // underline: getPluginType(editor, MARK_UNDERLINE),
      // subscript: getPluginType(editor, MARK_SUBSCRIPT),
      // superscript: getPluginType(editor, MARK_SUPERSCRIPT),
      code_block: getPluginType(editor, ELEMENT_CODE_BLOCK),
      thematic_break: getPluginType(editor, ELEMENT_HR),
      ul_list: getPluginType(editor, ELEMENT_UL),
      ol_list: getPluginType(editor, ELEMENT_OL),
      listItem: getPluginType(editor, ELEMENT_LI),
      heading: {
        1: getPluginType(editor, ELEMENT_H1),
        2: getPluginType(editor, ELEMENT_H2),
        3: getPluginType(editor, ELEMENT_H3),
        4: getPluginType(editor, ELEMENT_H4),
        5: getPluginType(editor, ELEMENT_H5),
        6: getPluginType(editor, ELEMENT_H6)
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
const createDeserializeMdPlugin = createPluginFactory({
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
            if (isUrl(data)) {
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

export { KEY_DESERIALIZE_MD, createDeserializeMdPlugin, deserializeMd, filterBreaklines };
//# sourceMappingURL=index.es.js.map
