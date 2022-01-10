<?php

namespace Drupal\tinypng;

use Drupal\Core\Entity\EntityInterface;

/**
 * Interface TinyPngImageHandlerInterface.
 *
 * @package Drupal\tinypng
 */
interface TinyPngImageHandlerInterface {

  /**
   * Implements hook_entity_presave().
   *
   * Process the image with TinyPNG service.
   */
  public function hookEntityPresave(EntityInterface $entity);

}
