declare module 'icecast-metadata-player' {
  interface IcecastMetadata {
    StreamTitle?: string;
    StreamUrl?: string;
    [key: string]: any;
  }

  interface IcecastMetadataPlayerOptions {
    audioElement?: HTMLAudioElement;
    enableLogging?: boolean;
    metadataTypes?: string[];
    retryTimeout?: number;
    bufferLength?: number;
    icyMetaInt?: number;
    icyCharacterEncoding?: string;
    icyDetectionTimeout?: number;
    retryDelayMin?: number;
    retryDelayMax?: number;
    retryDelayRate?: number;
    playbackMethod?: 'mediasource' | 'webaudio' | 'html5';
    endpointOrder?: 'ordered' | 'random';
    authentication?: {
      user: string;
      password: string;
    };
    
    // Callbacks
    onMetadata?: (metadata: IcecastMetadata, timestampOffset?: number, timestamp?: number) => void;
    onMetadataEnqueue?: (metadata: IcecastMetadata, timestampOffset?: number, timestamp?: number) => void;
    onLoad?: () => void;
    onStreamStart?: () => void;
    onBuffer?: (time: number) => void;
    onPlay?: () => void;
    onStream?: (streamData: any) => void;
    onStreamEnd?: () => void;
    onStop?: () => void;
    onRetry?: () => void;
    onRetryTimeout?: () => void;
    onWarn?: (message: string, ...messages: any[]) => void;
    onError?: (message: string, error?: any) => void;
    onCodecUpdate?: (codecInformation: any, updateTimestamp: number) => void;
  }

  class IcecastMetadataPlayer {
    constructor(endpoint: string | string[], options?: IcecastMetadataPlayerOptions);
    
    // Properties
    audioElement: HTMLAudioElement;
    endpoint: string;
    icyMetaInt: number;
    metadataQueue: any[];
    state: 'loading' | 'playing' | 'stopping' | 'stopped' | 'retrying';
    playbackMethod: 'mediasource' | 'webaudio' | 'html5';
    
    // Methods
    play(): Promise<void>;
    stop(): Promise<void>;
    switchEndpoint(endpoints?: string | string[], options?: IcecastMetadataPlayerOptions): Promise<void>;
    detachAudioElement(): void;
    
    // Static methods
    static canPlayType(mimeType: string): {
      mediasource: string;
      html5: string;
      webaudio: string;
    };
    
    // Event listener methods
    addEventListener(event: string, callback: Function): void;
    removeEventListener(event: string, callback: Function): void;
  }

  export = IcecastMetadataPlayer;
} 