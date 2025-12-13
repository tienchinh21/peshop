# Requirements Document

## Introduction

Tích hợp tính năng Chat vào giao diện Shop để cho phép Shop Owner gửi và nhận tin nhắn với khách hàng (User) trong thời gian thực. Hệ thống sẽ tái sử dụng các services và hooks từ customer chat feature, với điều chỉnh `SenderType = 2` (Shop) và hiển thị thông tin User thay vì Shop.

## Glossary

- **ShopChatWidget**: Component giao diện chat cho Shop Owner, hiển thị trong layout shop management
- **Conversation**: Cuộc trò chuyện giữa một Shop và một User
- **Message**: Tin nhắn trong một cuộc trò chuyện
- **SenderType**: Loại người gửi (1 = User, 2 = Shop) - Shop sử dụng type = 2
- **Partner**: Đối tác trong cuộc trò chuyện - với Shop thì partner là User

## Requirements

### Requirement 1

**User Story:** As a shop owner, I want to view my chat conversations with customers, so that I can track and respond to customer inquiries.

#### Acceptance Criteria

1. WHEN a shop owner opens the ShopChatWidget THEN the system SHALL fetch and display the list of conversations from the API endpoint `/Message/conversations?type=2`
2. WHEN conversations are loading THEN the system SHALL display a loading skeleton in the conversation list area
3. WHEN conversations are displayed THEN the system SHALL show customer name, customer avatar, last message, unread indicator, and timestamp for each conversation
4. WHEN the conversations list is empty THEN the system SHALL display an appropriate empty state message "Chưa có cuộc trò chuyện nào"

### Requirement 2

**User Story:** As a shop owner, I want to view message history with a customer, so that I can understand the context of our conversation.

#### Acceptance Criteria

1. WHEN a shop owner selects a conversation THEN the system SHALL fetch and display the message history from the API endpoint `/Message/chat?type=2&userId={userId}&shopId={shopId}`
2. WHEN messages are loading THEN the system SHALL display a loading skeleton in the message area
3. WHEN messages are displayed THEN the system SHALL show message content, timestamp, and sender indicator (me/customer) for each message
4. WHEN the message list has more pages THEN the system SHALL support infinite scroll to load older messages

### Requirement 3

**User Story:** As a shop owner, I want to send messages to customers, so that I can respond to their inquiries.

#### Acceptance Criteria

1. WHEN a shop owner types a message and clicks send THEN the system SHALL send the message to the API endpoint `/Message/send-message` with `type=2` and `userId` parameter
2. WHEN a message is being sent THEN the system SHALL display the message optimistically in the chat area
3. WHEN a message fails to send THEN the system SHALL revert the optimistic update and display an error indicator
4. WHEN the message input is empty or contains only whitespace THEN the system SHALL disable the send button
5. WHEN a message is sent successfully THEN the system SHALL clear the input field

### Requirement 4

**User Story:** As a shop owner, I want to receive real-time messages from customers, so that I can respond promptly.

#### Acceptance Criteria

1. WHEN the ShopChatWidget is mounted THEN the system SHALL establish a SignalR connection with `type=2` parameter
2. WHEN a new message arrives via SignalR THEN the system SHALL update the message list in real-time without page refresh
3. WHEN a new message arrives for a non-active conversation THEN the system SHALL update the conversation's lastMessage and mark it as unread
4. WHEN the SignalR connection is lost THEN the system SHALL display "Đang kết nối lại..." indicator and attempt to reconnect

### Requirement 5

**User Story:** As a shop owner, I want to identify the correct partner (customer) in conversations, so that I can communicate with the right person.

#### Acceptance Criteria

1. WHEN displaying conversation list THEN the system SHALL show User information (userName, userAvatar) as the partner
2. WHEN displaying message area header THEN the system SHALL show User name and avatar
3. WHEN determining sender type THEN the system SHALL use `SenderType.Shop (2)` for all API calls
4. WHEN normalizing messages THEN the system SHALL mark messages from Shop as "me" and messages from User as "other"

### Requirement 6

**User Story:** As a shop owner, I want to search conversations by customer name, so that I can quickly find specific customers.

#### Acceptance Criteria

1. WHEN a shop owner enters a search term THEN the system SHALL filter conversations by customer name (case-insensitive)
2. WHEN the search term is empty THEN the system SHALL display all conversations
3. WHEN no conversations match the search THEN the system SHALL display "Không tìm thấy cuộc trò chuyện nào"

### Requirement 7

**User Story:** As a shop owner, I want to see unread message indicators, so that I can prioritize responding to new messages.

#### Acceptance Criteria

1. WHEN a conversation has unread messages THEN the system SHALL display an unread indicator (red dot) on the conversation item
2. WHEN the total unread count is greater than zero THEN the system SHALL display the count on the chat toggle button
3. WHEN a shop owner opens a conversation THEN the system SHALL mark that conversation as read

### Requirement 8

**User Story:** As a shop owner, I want the chat widget to be accessible from the shop management layout, so that I can chat while managing my shop.

#### Acceptance Criteria

1. WHEN a shop owner is on any shop management page THEN the system SHALL display the chat toggle button in a fixed position
2. WHEN the chat widget is open THEN the system SHALL not interfere with the main shop management content
3. WHEN clicking outside the chat widget THEN the system SHALL close the widget
