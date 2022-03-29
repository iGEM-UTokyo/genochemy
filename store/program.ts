import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Block } from '~/utils/block'

@Module({
  name: 'program',
  stateFactory: true,
  namespaced: true,
})
export default class ProgramModule extends VuexModule {
  blocks: Block[] = []

  @Mutation
  addBlock(block: Block) {
    this.blocks.push(block)
  }
}
