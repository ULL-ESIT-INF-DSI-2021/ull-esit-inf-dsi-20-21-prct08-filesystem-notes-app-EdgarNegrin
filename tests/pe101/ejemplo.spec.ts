import 'mocha';
import {expect} from 'chai';
import {holamundo} from '../../src/pe101/ejemplo'

describe('Tests', () => {
  it('Hola mundo', () => {
    expect(holamundo()).to.be.equal("Hola mundo");
  });
});
