import { MaskEmailPipe } from './mask-email-pipe.pipe';

describe('MaskEmailPipePipe', () => {
  it('create an instance', () => {
    const pipe = new MaskEmailPipe();
    expect(pipe).toBeTruthy();
  });
});
