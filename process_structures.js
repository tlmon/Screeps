const towers = require('towers');
const links = require('links');
const terminals = require('terminals');

function process_towers() {
    towers.main();
}

function process_links() {
    links.main();
}

function process_terminals() {
    if(Game.time % 100 != 0)
        return;
    terminals.main();
}

module.exports = {
  main : function() {
    process_terminals();
    process_links();
    process_towers();
  }
};