import { Layers, Node, UITransform } from 'cc'

export function createUINode(name: string = '') {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  node.layer = 1 << Layers.nameToLayer('UI_2D')

  return node
}

export function randomByRange(min: number, max: number) {
  if (max < min) {
    ;[min, max] = [max, min]
  }

  return Math.floor(min + (max - min) * Math.random())
}
