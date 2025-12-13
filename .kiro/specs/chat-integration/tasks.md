# Implementation Plan

- [x] 1. Set up chat feature structure and types

  - [x] 1.1 Create feature directory structure

    - Create `src/features/customer/chat/` with subdirectories: components, hooks, services, types, utils
    - Create barrel exports (index.ts) for each subdirectory
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 1.2 Define TypeScript types and interfaces

    - Create `chat.types.ts` with SenderType enum, Conversation, Message, ChatHistoryResponse, NormalizedMessage, SendMessageRequest, SendMessageResponse interfaces
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ]\* 1.3 Write property test for API type parameter consistency
    - **Property 1: API Type Parameter Consistency**
    - **Validates: Requirements 1.1, 4.1, 4.2, 4.3**

- [x] 2. Implement chat service layer

  - [x] 2.1 Create chat service with API methods

    - Implement `getConversations(type)` calling `/Message/conversations`
    - Implement `getChatHistory(params)` calling `/Message/chat`
    - Implement `sendMessage(request)` calling `/Message/send-message`
    - Use axiosDotnet client with auth interceptors
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.2, 4.3_

  - [x] 2.2 Create message utility functions

    - Implement `normalizeMessages(it, me)` to merge and sort messages
    - Implement `getSenderType(roles)` to determine user type
    - Implement `formatMessageTime(date)` for timestamp display
    - _Requirements: 2.3, 2.5_

  - [ ]\* 2.3 Write property test for message normalization ordering
    - **Property 5: Message Normalization Ordering**
    - **Validates: Requirements 2.1, 2.3**

- [x] 3. Implement React Query hooks

  - [x] 3.1 Create useConversations hook

    - Fetch conversations using TanStack Query
    - Handle loading, error, and refetch states
    - Auto-detect user type from auth state
    - _Requirements: 1.1, 1.2, 1.5, 4.1_

  - [x] 3.2 Create useMessages hook with infinite scroll

    - Implement infinite query for paginated messages
    - Normalize messages from API response
    - Support fetchNextPage for older messages
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.3 Create useSendMessage hook

    - Implement mutation for sending messages
    - Add optimistic update to message list
    - Handle success (clear input) and error (rollback) states
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]\* 3.4 Write property test for send message payload structure
    - **Property 7: Send Message Payload Structure**
    - **Validates: Requirements 3.1, 4.3**

- [ ] 4. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

-

- [x] 5. Implement chat UI components

  - [x] 5.1 Create ConversationItem component

    - Display partner avatar, name, last message, timestamp
    - Show unread badge when applicable
    - Handle click to select conversation
    - _Requirements: 1.3, 1.4_

  - [ ]\* 5.2 Write property test for conversation display completeness
    - **Property 2: Conversation Display Completeness**
    - **Validates: Requirements 1.3, 1.4**
  - [x] 5.3 Create ConversationList component

    - Render list of ConversationItem components
    - Include search input with filtering
    - Show loading skeleton during fetch
    - _Requirements: 1.2, 6.1, 6.2, 6.3_

  - [ ]\* 5.4 Write property test for search filter behavior

    - **Property 11: Search Filter Behavior**

    - **Validates: Requirements 6.1, 6.3**

  - [x] 5.5 Create MessageBubble component

    - Display message content with timestamp
    - Apply correct alignment based on sender

    - Show sending/error indicators

    - _Requirements: 2.3, 2.5, 3.2, 3.4_

  - [x]\* 5.6 Write property test for message alignment correctness

    - **Property 3: Message Alignment Correctness**
    - **Validates: Requirements 2.3**

  - [x] 5.7 Create MessageArea component

    - Render list of MessageBubble components
    - Implement infinite scroll for older messages

    - Show loading indicator during fetch

    - Auto-scroll to bottom on new messages
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 5.8 Create MessageInput component

    - Input field with emoji and image buttons (UI only)
    - Send button with disabled state for empty input
    - Handle form submission
    - _Requirements: 3.1, 3.5_

  - [ ]\* 5.9 Write property test for empty message prevention
    - **Property 6: Empty Message Prevention**
    - **Validates: Requirements 3.5**
  - [x] 5.10 Create ChatSkeleton components

    - ConversationListSkeleton for loading state
    - MessageAreaSkeleton for loading state
    - _Requirements: 1.2, 2.2_

- [x] 6. Integrate and refactor ChatWidget

  - [x] 6.1 Refactor ChatWidget to use new components

    - Replace mock data with useConversations hook
    - Integrate ConversationList component
    - Integrate MessageArea component
    - Integrate MessageInput component
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 6.2 Add user type detection and partner display logic

    - Detect if current user is User or Shop
    - Display correct partner info based on user type
    - _Requirements: 4.1, 4.4_

  - [ ]\* 6.3 Write property test for conversation partner display
    - **Property 9: Conversation Partner Display**
    - **Validates: Requirements 4.4**

- [ ] 7. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement SignalR real-time messaging (Optional)

  - [x] 8.1 Create SignalR service

    - Implement connection management (connect, disconnect, reconnect)
    - Handle connection state changes
    - _Requirements: 5.4_

  - [x] 8.2 Create useSignalR hook

    - Manage SignalR connection lifecycle
    - Expose connection status
    - Handle reconnection logic
    - _Requirements: 5.4_

  - [x] 8.3 Integrate real-time message handling

    - Listen for new message events
    - Update active conversation messages
    - Update unread count for inactive conversations
    - _Requirements: 5.1, 5.2_

  - [ ]\* 8.4 Write property test for real-time message integration
    - **Property 10: Real-time Message Integration**
    - **Validates: Requirements 5.1, 5.2**

- [ ] 9. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
