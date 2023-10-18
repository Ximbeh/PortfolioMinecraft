function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    //talvez tirar essse pra ele pular por cima
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  )
}

Array.prototype.parse2D = function () {
  const rows = [];
  for (let i = 0; i < this.length; i += 96) {
    rows.push(this.slice(i, i + 96));
  }

  return rows;
};

Array.prototype.createObjectFrom2D = function () {
  const objects = [];
  this.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol != 0) {
        objects.push(
          new CollisionBlock({
            position: {
              x: x * 32,
              y: y * 32,
            },
          })
        );
      }
    });
  });

  return objects;
};