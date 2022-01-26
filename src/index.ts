import EncodePKCE from './utils/utils';

class CustomSdk {
  protected url: string;
  protected clientId: string;
  protected redirectUrl: string;

  constructor(url: string, clientId: string, redirectUrl: string) {
    this.url = url;
    this.clientId = clientId;
    this.redirectUrl = redirectUrl;
  }

  private create_code_verifier(): string {
    const sdkMagic = new EncodePKCE();
    const codes = sdkMagic.getCodes(42);
    return '1';
  }
  public test(): number {
    this.create_code_verifier();
    return 42;
  }
}

export default CustomSdk;
