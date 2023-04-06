export interface CacheNode<T> {
  key: string;
  value: T;
  prev: CacheNode<T> | null;
  next: CacheNode<T> | null;
  created: number;
}

export class LRUCache<T> {
  private readonly capacity: number;
  private readonly cache: Map<string, CacheNode<T>> = new Map();
  private head: CacheNode<T> | null = null;
  private tail: CacheNode<T> | null = null;
  readonly maxAge: number;

  constructor(capacity: number, maxAge: number = 3600 * 1000 /* 1 hour */) {
    this.capacity = capacity;
    this.maxAge = maxAge;
  }

  get(key: string): T | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;

    if (Date.now() - node.created > this.maxAge) {
      this.cache.delete(node.key);
      this.remove(node);
      return undefined;
    }

    this.remove(node);
    this.add(node);

    return node.value;
  }

  clear(key: string): void {
    const node = this.cache.get(key);
    if (!node) return;

    this.cache.delete(node.key);
    this.remove(node);
  }

  set(key: string, value: T): void {
    let node = this.cache.get(key);
    if (node) {
      node.value = value;
      this.remove(node);
      this.add(node);
    } else {
      node = { key, value, prev: null, next: null, created: Date.now() };
      this.add(node);
      this.cache.set(key, node);

      if (this.cache.size > this.capacity) {
        this.cache.delete(this.tail!.key);
        this.remove(this.tail!);
      }
    }
  }

  getCache(): Map<string, CacheNode<T>> {
    return this.cache;
  }

  private add(node: CacheNode<T>): void {
    if (this.head) {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    } else {
      this.head = node;
      this.tail = node;
    }
  }

  private remove(node: CacheNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }
}
