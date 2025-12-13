# Requirements Document

## Introduction

Tích hợp Message API vào ChatWidget component để cho phép User và Shop gửi tin nhắn cho nhau trong thời gian thực. Hệ thống sẽ thay thế mock data hiện tại bằng dữ liệu thực từ API, hỗ trợ xem danh sách cuộc trò chuyện, lịch sử tin nhắn và gửi tin nhắn mới.

## Glossary

- **ChatWidget**: Component giao diện chat floating ở góc phải màn hình
- **Conversation**: Cuộc trò chuyện giữa một User và một Shop
- **Message**: Tin nhắn trong một cuộc trò chuyện
- **SenderType**: Loại người gửi (1 = User, 2 = Shop)
- **JWT Token**: Token xác thực chứa thông tin UserId hoặc ShopId

## Requirements

### Requirement 1

**User Story:** As a customer, I want to view my chat conversations with shops, so that I can track my communication history.

#### Acceptance Criteria

1. WHEN a user opens the ChatWidget THEN the system SHALL fetch and display the list of conversations from the API endpoint `/Message/conversations?type=1`
2. WHEN conversations are loading THEN the system SHALL display a loading skeleton in the conversation list area
3. WHEN the API returns conversations THEN the system SHALL display each conversation with shop name, shop avatar, last message, timestamp, and unread indicator
4. WHEN a conversation has unread messages THEN the system SHALL display a badge showing the unread count
5. IF the API request fails THEN the system SHALL display an error message and provide a retry option

### Requirement 2

**User Story:** As a customer, I want to view message history with a shop, so that I can review our previous conversations.

#### Acceptance Criteria

1. WHEN a user selects a conversation THEN the system SHALL fetch message history from the API endpoint `/Message/chat` with pagination parameters
2. WHEN messages are loading THEN the system SHALL display a loading indicator in the message area
3. WHEN the API returns messages THEN the system SHALL display messages with correct sender alignment (user messages on right, shop messages on left)
4. WHEN the user scrolls to the top of the message list THEN the system SHALL load older messages if available (infinite scroll)
5. WHEN messages are displayed THEN the system SHALL show timestamp for each message

### Requirement 3

**User Story:** As a customer, I want to send messages to a shop, so that I can communicate about products or orders.

#### Acceptance Criteria

1. WHEN a user types a message and submits THEN the system SHALL send the message via POST to `/Message/send-message` with type=1
2. WHEN a message is being sent THEN the system SHALL display a sending indicator on the message
3. WHEN the message is sent successfully THEN the system SHALL add the message to the conversation and clear the input field
4. IF the message fails to send THEN the system SHALL display an error indicator and provide a retry option
5. WHEN a user attempts to send an empty message THEN the system SHALL prevent submission and maintain the current state

### Requirement 4

**User Story:** As a shop owner, I want to view and respond to customer messages, so that I can provide customer support.

#### Acceptance Criteria

1. WHEN a shop owner opens the ChatWidget THEN the system SHALL fetch conversations from `/Message/conversations?type=2`
2. WHEN a shop owner selects a conversation THEN the system SHALL fetch message history with type=2 parameter
3. WHEN a shop owner sends a message THEN the system SHALL send via POST to `/Message/send-message` with type=2
4. WHEN displaying conversations for shop THEN the system SHALL show customer name and avatar instead of shop info

### Requirement 5

**User Story:** As a user, I want the chat to update in real-time, so that I can have live conversations.

#### Acceptance Criteria

1. WHEN a new message arrives via SignalR THEN the system SHALL append the message to the active conversation immediately
2. WHEN a new message arrives for a non-active conversation THEN the system SHALL update the unread count badge
3. WHEN the user is viewing a conversation THEN the system SHALL mark messages as read automatically
4. WHEN connection to SignalR is lost THEN the system SHALL attempt to reconnect and notify the user of connection status

### Requirement 6

**User Story:** As a user, I want to search through my conversations, so that I can quickly find a specific shop or customer.

#### Acceptance Criteria

1. WHEN a user types in the search input THEN the system SHALL filter the conversation list by name
2. WHEN search results are empty THEN the system SHALL display a "no results" message
3. WHEN the user clears the search input THEN the system SHALL restore the full conversation list
