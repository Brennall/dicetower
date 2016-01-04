#!/usr/bin/env node

/*
 * dice rolling using a nearley parser
 */

import nearley from 'nearley';
import grammar from './grammar';

const OPEN_PAREN = '('
const CLOSE_PAREN = ')'

// returns a syntax tree from a string like "(1d4 + 2)^10"
export function parse(string) {
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  parser.feed(string);
  return parser.results;
}

export function evaluate(tree) {
  return unwrap(tree).value;
}

function contains(needle, haystack) {
  return haystack.indexOf(needle) > -1;
}

// render the annotation of a tree
export function render(almostTree) {
  const tree = unwrap(almostTree);
  //console.log('render', tree)
  debugger;
  if (tree === null) return 'NULL';
  if (tree.src) return render(tree.src);
  if (Array.isArray(tree)) {
    // handle paren arrays
    if (tree[0] === OPEN_PAREN && tree[tree.length - 1] === CLOSE_PAREN) {
      return '(' + render(tree.slice(1, -1)) + ')';
    }

    return tree.map(render).join(' ');
  }
  return tree;
}

function unwrap(array) {
  if (!Array.isArray(array)) return array;
  const noNulls = array.filter(Boolean);
  const reduced = noNulls.map(unwrap);
  if (noNulls.length === 1) return unwrap(noNulls[0]);
  return reduced;
}

export function run(input) {
  console.log(`input: ${input}`)
  const tree = parse(input)
  console.log('--- tree ---')
  console.log(JSON.stringify(tree, null, "  ")) // unwrap(unwrap(tree).src), null, "  "))
  console.log('--- result ---')
  console.log(evaluate(tree))
  console.log('--- annotation ---')
  console.log(render(tree));
}

function main() {
  const input = process.argv[2];
  run(input);
}

main();