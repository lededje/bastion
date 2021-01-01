import randomWords from './randomWords';

describe('randomWords', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
      jest.spyOn(global.Math, 'random').mockRestore();
  })

  it('returns three random words', () => {    
    expect(randomWords(3)).toMatchSnapshot();
  })
})
