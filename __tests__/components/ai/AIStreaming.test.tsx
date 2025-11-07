import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Share, LayoutAnimation } from 'react-native';
import { AIStreaming } from '@/components/ai/AIStreaming';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-markdown-display', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AIStreaming', () => {
  beforeAll(() => {
    Object.assign(LayoutAnimation, {
      configureNext: jest.fn(),
      Presets: { easeInEaseOut: {} },
    });

    // Provide navigator clipboard for copy handler
    (global as any).navigator = {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    };

    jest.spyOn(Share, 'share').mockResolvedValue({ action: 1 } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders streamed text', () => {
    const { getByText } = render(
      <AIStreaming
        text={'Hello world'}
        isStreaming={false}
        title="Test Assistant"
      />,
    );

    expect(getByText('Hello world')).toBeTruthy();
  });

  it('invokes onRegenerate when the Regenerate button is pressed', () => {
    const handleRegenerate = jest.fn();
    const { getByText } = render(
      <AIStreaming
        text={'Answer'}
        onRegenerate={handleRegenerate}
      />,
    );

    fireEvent.press(getByText('Regenerate'));
    expect(handleRegenerate).toHaveBeenCalledTimes(1);
  });

  it('shares content when Share button is pressed', async () => {
    const { getByText } = render(<AIStreaming text={'Content to share'} />);

    fireEvent.press(getByText('Share'));

    await waitFor(() => {
      expect(Share.share).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Content to share' }),
      );
    });
  });

  it('copies content when Copy button is pressed', async () => {
    const { getByText, findByText } = render(<AIStreaming text={'Copy me'} />);

    fireEvent.press(getByText('Copy'));

    await findByText('Copied');
    expect((navigator as any).clipboard.writeText).toHaveBeenCalledWith('Copy me');
  });
});

