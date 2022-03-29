import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import program from '~/store/program'

let programStore: program

function initialiseStores(store: Store<any>): void {
  programStore = getModule(program, store)
}

export { initialiseStores, programStore }
