
const res_list = ['O', 'H', 'L', 'Z'];
const min_prices = {'O' : 4.1, 'H' : 8, 'L' : 8, 'Z' : 8};
const max_energy = {'O' : 0.5, 'H' : 1, 'L' : 1, 'Z' : 1};

const min_pixels = 0;
const min_pixels_prices = 29000;

function sell_pixels(){
  if(Game.resources[PIXEL] <= min_pixels)
    return;
  const orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: PIXEL});
  var best_order = null;
  var best_price = 0;
  for(let i=0; i<orders.length; i++) {
    if(orders[i].price > best_price){
      best_price = orders[i].price;
      best_order = orders[i];
    }
  }
  if(best_price < min_pixels_prices)
    return;
  var max_amount = Game.resources[PIXEL] - min_pixels;
  if(max_amount > best_order.amount)
    max_amount = best_order.amount;
  var res = Game.market.deal(best_order.id, max_amount);
  console.log('sell pixels, amount:', max_amount, 'price:', best_order.price, 'result:', res);
}

function sell_energey(term, rm) {
    const term_energy = term.store[RESOURCE_ENERGY];
    if (term_energy <= 1e5)
        return;
}

function sell_resources(term, rm){
  if(term.cooldown > 0)
    return;
  const term_energy = term.store[RESOURCE_ENERGY];
  for(i in res_list){
    const cur_res = res_list[i];
    const maxTransferEnergyCost = 1000 * max_energy[cur_res];
    const term_res = term.store[cur_res];
    if(term_res == 0)
      continue;
    const orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: cur_res});
    var best_order = null;
    var best_cost = maxTransferEnergyCost + 1;
    for(let i=0; i<orders.length; i++) {
      const transferEnergyCost = Game.market.calcTransactionCost(1000, rm.name, orders[i].roomName);
      if(orders[i].amount < 1)
        continue;
      if(orders[i].price < min_prices[cur_res])
        continue;
      if(transferEnergyCost < best_cost){
        best_cost = transferEnergyCost;
        best_order = orders[i];
      }
    }
    if(!best_order)
      continue;
    var max_amount = Math.round(term_energy / best_cost * 1000, 0) - 1;
    if(max_amount > term_res)
      max_amount = term_res;
    if(max_amount > best_order.amount)
      max_amount = best_order.amount;
    var res = Game.market.deal(best_order.id, max_amount, rm.name);
    console.log('sell resource', cur_res, 'amount:', max_amount, 'from room:', rm.name,
        'price:', best_order.price, 'transfer cost:', best_cost, 'result:', res);

  }

}

module.exports = {
    main : function()
    {
      sell_pixels();
      var main_rooms = [Game.rooms['W38N44'], Game.rooms['W38N45'], Game.rooms['W39N45'], Game.rooms['W38N46'], Game.rooms['W39N46'], Game.rooms['W39N44']];
        for(i in main_rooms)
        {
            var room = main_rooms[i];
            var term = room.terminal;
            if(term) {
              sell_resources(term, room);
              sell_energey(term, room);
            }
        }
    }
};
