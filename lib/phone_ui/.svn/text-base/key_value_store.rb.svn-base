module PhoneUi
  class KeyValueStore
    def initialize
      @critical ||= Mutex.new
      @store ||= {}
    end
    
    # This is a method that wraps actions
    # that are not thread-safe
    def critical(&block)
      @critical.synchronize(&block)
    end
    
    def read(key)
      critical { @store[key] }
    end
    
    def write(key, value)
      critical { @store[key] = value }
    end
    
    def [](key)
      read(key)
    end
    
    def []=(key, value)
      write(key, value)
    end
  end
end
