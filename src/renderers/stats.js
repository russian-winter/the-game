export default class Stats {
  constructor() {
    this.color = 'rgba(0, 0, 0, 0.5)';
  }

  render(context, game) {
    const xPlayerPosition = game.player.position.x;
    const yPlayerPosition = game.player.position.y;
    const numOfObjects = game.world.objects.length;

    // context.fillColor = '#fff';
    // context.fillRect(0, 0, 150, 150);
    context.fillStyle = this.color;
    context.font = '18px Arial';
    context.fillText(`X: ${xPlayerPosition}`, 10, 20);
    context.fillText(`Y: ${yPlayerPosition}`, 10, 50);
    context.fillText(`N: ${numOfObjects}`, 10, 80);
  }
}
