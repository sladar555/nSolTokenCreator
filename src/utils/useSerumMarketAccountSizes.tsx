import {
  calculateTotalAccountSize,
  EVENT_QUEUE_HEADER_SIZE,
  EVENT_SIZE,
  ORDERBOOK_HEADER_SIZE,
  ORDERBOOK_NODE_SIZE,
  REQUEST_QUEUE_HEADER_SIZE,
  REQUEST_SIZE,
} from "./serum";

export default function useSerumMarketAccountSizes({
  eventQueueLength,
  requestQueueLength,
  orderbookLength,
}) {
  const totalEventQueueSize = calculateTotalAccountSize(
    eventQueueLength,
    EVENT_QUEUE_HEADER_SIZE,
    EVENT_SIZE
  );

  const totalRequestQueueSize = calculateTotalAccountSize(
    requestQueueLength,
    REQUEST_QUEUE_HEADER_SIZE,
    REQUEST_SIZE
  );

  const totalOrderbookSize = calculateTotalAccountSize(
    orderbookLength,
    ORDERBOOK_HEADER_SIZE,
    ORDERBOOK_NODE_SIZE
  );

  return {
    totalEventQueueSize,
    totalRequestQueueSize,
    totalOrderbookSize,
  };
};