const sanitize = require('../sanitize.middleware');

describe('Sanitization Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {}
    };
    res = {};
    next = jest.fn();
  });

  it('should sanitize strings in request body', () => {
    req.body = {
      username: 'testuser<script>alert("xss")</script>',
      email: 'test@example.com\0',
      description: '  Clean text  '
    };

    sanitize(req, res, next);

    expect(req.body.username).toBe('testuser');
    expect(req.body.email).toBe('test@example.com');
    expect(req.body.description).toBe('Clean text');
  });

  it('should sanitize strings in request query', () => {
    req.query = {
      search: 'test<script>alert("xss")</script>',
      category: 'music\0'
    };

    sanitize(req, res, next);

    expect(req.query.search).toBe('test');
    expect(req.query.category).toBe('music');
  });

  it('should sanitize strings in request params', () => {
    req.params = {
      id: '123<script>alert("xss")</script>',
      name: 'test\0'
    };

    sanitize(req, res, next);

    expect(req.params.id).toBe('123');
    expect(req.params.name).toBe('test');
  });

  it('should handle nested objects', () => {
    req.body = {
      user: {
        username: 'testuser<script>alert("xss")</script>',
        profile: {
          bio: '  Bio text  \0'
        }
      }
    };

    sanitize(req, res, next);

    expect(req.body.user.username).toBe('testuser');
    expect(req.body.user.profile.bio).toBe('Bio text');
  });

  it('should handle arrays', () => {
    req.body = {
      tags: [
        'tag1<script>alert("xss")</script>',
        'tag2\0',
        { name: 'tag3<script>alert("xss")</script>' }
      ]
    };

    sanitize(req, res, next);

    expect(req.body.tags[0]).toBe('tag1');
    expect(req.body.tags[1]).toBe('tag2');
    expect(req.body.tags[2].name).toBe('tag3');
  });

  it('should call next middleware', () => {
    sanitize(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});