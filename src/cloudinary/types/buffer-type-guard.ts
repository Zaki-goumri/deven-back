import { BufferType } from './buffer.type';

export function isBufferType(obj: any): obj is BufferType {
  return obj instanceof BufferType;
}
