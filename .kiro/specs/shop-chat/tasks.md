# Implementation Plan

- [x] 1. Set up shop chat feature structure

  - [x] 1.1 Create feature directory structure

    - Create `src/features/shop/chat/` with subdirectories: components, context, hooks (if needed)
    - Create barrel export file `index.ts`
    - _Requirements: 8.1_

  - [x] 1.2 Create ShopChatContext

    - Create context for managing shop chat open/close state
    - Implement `ShopChatProvider` component
    - Export `useShopChatContext` hook
    - _Requirements: 8.1, 8.2_

- [x] 2. Implement ShopChatWidget component

  - [x] 2.1 Create ShopChatWidget main component

    - Implement floating toggle button with unread badge
    - Implement two-panel layout (conversation list + message area)
    - Use existing hooks: `useConversations`, `useMessages`, `useSendMessage`, `useChatRealtime`
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

  - [ ]\* 2.2 Write property test for SenderType detection

    - **Property 1: SenderType Detection for Shop**
    - **Validates: Requirements 5.3**

  - [x] 2.3 Implement partner display logic for Shop

    - When senderType === 2, display User info (userName, userAvatar) as partner
    - Update conversation list to show customer info
    - Update message area header to show customer info
    - _Requirements: 5.1, 5.2_

  - [ ]\* 2.4 Write property test for partner display

    - **Property 2: Partner Display for Shop**
    - **Validates: Requirements 5.1, 5.2**

  - [ ]\* 2.5 Write property test for message normalization
    - **Property 3: Message Normalization for Shop**
    - **Validates: Requirements 5.4**

- [x] 3. Implement conversation list features

  - [x] 3.1 Implement search filter for conversations

    - Filter by customer name (userName) case-insensitive
    - Show empty state when no matches
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]\* 3.2 Write property test for conversation search

    - **Property 4: Conversation Search Filter**
    - **Validates: Requirements 6.1, 6.2, 6.3**

  - [x] 3.3 Implement unread indicators

    - Show red dot on conversations with seen=false
    - Show total unread count on toggle button
    - _Requirements: 7.1, 7.2_

  - [ ]\* 3.4 Write property test for unread count
    - **Property 7: Unread Count Calculation**
    - **Validates: Requirements 7.1, 7.2**

- [ ] 4. Checkpoint - Ensure conversation features work

  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement message sending features

  - [x] 5.1 Implement send message with correct payload

    - Send with type=2 and userId parameter
    - Implement optimistic updates
    - Handle send failure with rollback
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]\* 5.2 Write property test for empty message prevention

    - **Property 5: Empty Message Prevention**
    - **Validates: Requirements 3.4**

  - [ ]\* 5.3 Write property test for optimistic updates

    - **Property 6: Optimistic Update Round-Trip**
    - **Validates: Requirements 3.2, 3.3**

  - [x] 5.4 Implement input clearing on success

    - Clear input field after successful send
    - _Requirements: 3.5_

- [x] 6. Implement real-time features

  - [x] 6.1 Integrate SignalR with type=2

    - Use existing useChatRealtime hook
    - Verify connection with type=2 parameter
    - _Requirements: 4.1_

  - [x] 6.2 Handle real-time message updates

    - Update message list for active conversation
    - Update conversation list for non-active conversations
    - _Requirements: 4.2, 4.3_

  - [ ]\* 6.3 Write property test for real-time message update

    - **Property 9: Real-time Message Update**
    - **Validates: Requirements 4.2**

  - [ ]\* 6.4 Write property test for non-active conversation update

    - **Property 10: Non-Active Conversation Update**
    - **Validates: Requirements 4.3**

  - [x] 6.5 Implement connection status indicator

    - Show "Đang hoạt động" when connected
    - Show "Đang kết nối lại..." when reconnecting
    - Show "Offline" with retry button when disconnected
    - _Requirements: 4.4_

- [x] 7. Implement read status management

  - [x] 7.1 Mark conversation as read when selected

    - Update seen status in local cache
    - _Requirements: 7.3_

  - [ ]\* 7.2 Write property test for read status update
    - **Property 8: Conversation Read Status Update**
    - **Validates: Requirements 7.3**

- [x] 8. Integrate with shop layout

  - [x] 8.1 Add ShopChatProvider to shop layout

    - Wrap shop layout with ShopChatProvider
    - _Requirements: 8.1_

  - [x] 8.2 Add ShopChatWidget to shop layout

    - Render ShopChatWidget in shop layout
    - Ensure fixed positioning doesn't interfere with content
    - _Requirements: 8.1, 8.2_

  - [x] 8.3 Implement click outside to close

    - Close widget when clicking outside
    - _Requirements: 8.3_

- [ ] 9. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
