import { describe, expect, it } from 'vitest'
import { SIMULATION_NOTICE } from '../../shared/constants/simulation'

describe('simulation notice', () => {
  it('explicitly identifies the demonstration and absence of real money', () => {
    expect(SIMULATION_NOTICE).toContain('Modo demonstração')
    expect(SIMULATION_NOTICE).toContain('sem dinheiro real')
  })
})
