export default (context, game) => {
  const xPlayerPosition = game.player.position.x;
  const yPlayerPosition = game.player.position.y;
  const numOfObjects = game.world.objects.length;

  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.font = '18px Arial';
  context.fillText(`X: ${xPlayerPosition}`, 10, 20);
  context.fillText(`Y: ${yPlayerPosition}`, 10, 50);
  context.fillText(`N: ${numOfObjects}`, 10, 80);
};
